/// <reference path='./models.ts' />

module Common.Models {

	export class Modifiable 
	extends Common.Models.Storable
	implements Common.Interfaces.IModifiable {
		
		public callbacks: Function[];
		public modified: boolean;
		public checksum: string;
		public original: string;
		public lastModified: number;
		public context: any;
		public isContextSet: boolean;
		public listeners: any;

		/**
		 * NOTE: Allows dynamically setting whether the given Modifiable
		 * is actively listening for changes. I.e., if true,
		 * every modification to the object will trigger a rehash
		 * of the checksum and modification info; otherwise, 
		 * the rehash will be ignored, effectively causing the object
		 * to ignore changes to itself.
		 * 
		 * @type {Boolean}
		 */
		public listening: boolean;

		constructor() {
			super();
			this.lastModified = Date.now();
			this.modified = false;
			this.checksum = null;
			this.original = null;

			// always listening. To prevent re-hashing from occurring when initializing
			// an object, insert the .listen(false) method into the method chain prior
			// to calling a method that will trigger a modification.
			this.listening = true;
			this.callbacks = [];
			this.listeners = {
				'onready': <Common.Interfaces.IInvokableCallback[]>[],
				'onload': <Common.Interfaces.IInvokableCallback[]>[]
			};

			this.isContextSet = false;
		}

		public checkContextSet(): void {
			if(!this.context || !this.isContextSet)
				throw new Error('Modifiable: context is not set. Call setContext(context) before using this class');
		}

		public setContext(context: any): void {
			this.context = context;
			this.isContextSet = true;
		}

		/**
		 * Allows for switching the listening mechanism on or off
		 * within a method chain. listen(false) would prevent
		 * any mutation from triggering a rehash. Does not
		 * trigger a modification event when setting to true,
		 * you must invoke the modification event directly and
		 * separately if needed.
		 * 
		 * @param {boolean} startListening true or false
		 */
		public listen(startListening: boolean): Common.Interfaces.IModifiable {
			this.listening = startListening;
			return this;
		}

		/**
		 * Takes an action id ('onready', 'onclose', etc.) and a callback function to invoke
		 * when the action occurs. Optionally, you can pass a `persist` flag, which specifies
		 * whether to keep the callback in the array after it's been invoked (persist = true)
		 * or to remove the callback after it is called the first time (!persist).
		 * 
		 * @param {string}   actionId [description]
		 * @param {Function} callback [description]
		 * @param {boolean}  persist    default = false
		 */
		public setListener(actionId: string, callback: Function, persist?: boolean): void {
			 if (!this.listeners.hasOwnProperty(actionId))
                this.listeners[actionId] = [];

            this.listeners[actionId].push(
            	<Common.Interfaces.IInvokableCallback>{
            		callback: callback, 
            		persist: (persist === true)
            	}
            );
		}
		public hasListeners(): boolean {
			return Common.Utilities.isNotNullOrUndefined(this.callbacks) && this.callbacks.length > 0
		}
		public clearListeners(): void {
			// empty all callbacks
			this.callbacks = [];
		}
		public invokeListener(actionId: string, data?: any): void {
            if (!this.listeners[actionId])
                return;

            let invokables = this.listeners[actionId];

            let i = 0;
            while(i < invokables.length) {
            	let invokable = <Common.Interfaces.IInvokableCallback>invokables[i];

            	if(invokable) {
            		let callback = invokable.callback;
            		if(callback) {

            			// invoke the callback, passing in optional data param and
            			// this object's context
            			callback(data, this.context);

            			if(invokable.persist === false) {
            				// call and remove; don't increment iterator
            				// since length will change once we remove
            				// the element from the array.
            				invokables.splice(i, 1);
            			} else {
            				// increment iterator, skip ahead to next
            				// callback
            				i++;
            			}
            		}
            	}
            }
        }
		/**
		 * Register listeners to be fired when this object is modified.
		 * NOTE: the modifier will only keep the listener passed in if
		 * listening == true; otherwise, listeners will be ignored.
		 * 
		 * @param {Function} callback function to invoke when a modification
		 * occurs to this object.
		 */
		public onModified(callback: Function): void {
			if (this.listening) {
				this.callbacks.push(callback);
			}			
		}
		public isModified(): void {
			if(this.listening) {
				// current checksum and stored checksum mismatch; modified
				this.modified = true;

				// track the modification date/time
				this.lastModified = Date.now();

				// invoke each of the modifiable's callbacks
				for (let i = 0; i < this.callbacks.length; i++) {
					let callback = this.callbacks[i];
					callback(this.context);
				}	
			}			
		}

		/**
		 * Determines whether there are any changes to the object,
		 * or allows for explicitly committing a modification to the
		 * object to trigger its modification listeners to fire.
		 * 
		 * @param  {boolean} isModified (optional) true forces modification
		 * @return {boolean}            returns whether the object is modified
		 */
		public setModified(forciblyModify?: boolean): boolean {
			if (!this.listening) {
				this.modified = false;
				return false;
			}

			// resort to comparing checksums to determine if mod. is made
			else {
				let cs = this.generateChecksum(); 
				if (forciblyModify || cs !== this.checksum) {
					// trigger all callbacks listening for changes
					this.isModified();
				} else {
					this.modified = false;
				}
				this.checksum = cs;
			}
			return this.modified;
		}

		/**
		 * Generates a new checksum from the current object
		 * @return {string} the newly generated checksum
		 */
		public generateChecksum(): string {
			this.checkContextSet();

			// determine current checksum
			let json = this.context.toJson();
			return Common.Utilities.generateChecksum(json);
		}

		public copy(
			newElement: Common.Interfaces.IModifiable, 
			context: Common.Interfaces.IModifiable
		): Common.Interfaces.IModifiable {
			this.checkContextSet();
			
			let copiedJson = context.toJson();

			newElement.fromJson(copiedJson);
			newElement.setModified(true);

			return newElement;
		}

		public toJson(): any {
			return $.extend({
				lastModified: this.lastModified,
				checksum: this.checksum
			}, super.toJson());
		}
		public fromJson(json: any, ...args: any[]) {
			this.lastModified = json.lastModified;
			this.original = json.checksum;
			this.checksum = Common.Utilities.generateChecksum(this.toJson());

			super.fromJson(json);
		}
	}
}