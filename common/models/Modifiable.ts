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

		constructor(context: any) {
			super();
			this.context = context;
			this.lastModified = Date.now();
			this.modified = false;
			this.checksum = null;
			this.original = null;

			// always listening. To prevent re-hashing from occurring when initializing
			// an object, insert the .listen(false) method into the method chain prior
			// to calling a method that will trigger a modification.
			this.listening = true;

			this.callbacks = [];
		}

		/**
		 * Allows for switching the listening mechanism on or off
		 * within a method chain. listen(false) would prevent
		 * any mutation from triggering a rehash.
		 * 
		 * @param {boolean} startListening true or false
		 */
		public listen(startListening: boolean) {
			this.listening = startListening;
			return this;
		}
		private _clearListeners() {
			// empty all callbacks
			this.callbacks = [];
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
					callback(this);
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
				let cs = this._generateChecksum(); 
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
		private _generateChecksum(): string {
			// determine current checksum
			let json = this.context.toJson();
			return Common.Utilities.generateChecksum(json);
		}

		public copy(
			newElement: Common.Models.Modifiable, 
			context: Common.Models.Modifiable
		): Common.Models.Modifiable {
			
			let copiedJson = context.toJson();

			newElement.fromJson(copiedJson);
			newElement.setModified(true);

			return newElement;
		}

		public toJson(): any {
			return {
				lastModified: this.lastModified,
				guid: this.guid,
				checksum: this.checksum
			};
		}
		public fromJson(json: any) {
			this.modified = json.modified;
			this.lastModified = json.lastModified;
			this.guid = json.guid || this.guid;
			this.original = json.checksum;
			this.checksum = Common.Utilities.generateChecksum(this.toJson());
		}
	}
}