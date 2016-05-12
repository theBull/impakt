/// <reference path='./models.ts' />

module Common.Models {

	export class LinkedList<T extends Common.Interfaces.ILinkedListNode<Common.Interfaces.IModifiable>>
	extends Common.Models.Storable {

		public root: T;
		public last: T;
		private _length: number;
		private _modifiable: Common.Models.Modifiable;
		public callbacks: Function[];
		public modified: boolean;
		public checksum: string;
		public original: string;
		public lastModified: number;
		public context: any;
		public isContextSet: boolean;
		public listening: boolean;

		constructor() {
			super();
			this.root = null;
			this.last = null;
			this._length = 0;

			this._modifiable = new Common.Models.Modifiable();
			this._modifiable.setContext(this);
			this.callbacks = this._modifiable.callbacks;
			this.modified = this._modifiable.modified;
			this.checksum = this._modifiable.checksum;
			this.original = this._modifiable.original;
			this.lastModified = this._modifiable.lastModified;
			this.context = this._modifiable.context;
			this.isContextSet = this._modifiable.isContextSet;
			this.listening = this._modifiable.listening;
		}

		public setModified(forciblyModify?: boolean): boolean {
			let modified = this._modifiable.setModified(forciblyModify === true);
			this.modified = this._modifiable.modified;
			this.checksum = this._modifiable.checksum;
			this.lastModified = this._modifiable.lastModified;
			return modified;
		}
		public onModified(callback: Function): void {
			let self = this;
			this._modifiable.onModified(callback);
			this.forEach(function(modifiableItem, index) {
				if (Common.Utilities.isNullOrUndefined(modifiableItem))
					return;
				
				modifiableItem.onModified(function() {
					// child elements modified, 
					// propegate changes up to the parent
					self.setModified(true);
				});
			});
		}
		public isModified(): void {
			this._modifiable.isModified();
			this.lastModified = this._modifiable.lastModified;
		}
		/**
		 * When commanding the collection whether to listen, 
		 * apply the true/false argument to all of its contents as well
		 * @param {boolean} startListening true to start listening, false to stop
		 */
		public listen(startListening: boolean) {

			this._modifiable.listening = startListening;
			this.listening = startListening;

			return this;
		}

		public add(node: T) {
			if (!this.root) {
				this.root = node;
				this.root.prev = null;
			} else {
				let temp = this.root;
				while (temp.next != null) {
					temp = <T>temp.next;
				}
				node.prev = temp;
				temp.next = node;
			}
			this.last = node;

			this._length++;

			let self = this;
			node.onModified(function() {
				self.setModified(true);
			});

			this.setModified(true);
		}

		public getIndex(index: number): T {
			let count = 0;
			let temp = this.root;
			if (!temp)
				return null;

			while (temp) {
				if (count == index)
					return temp;

				if (temp.next) {
					temp = <T>temp.next;
					count++;
				} else {
					return null;
				}
			}
		}

		public forEach(iterator: Function): void {
			let index = 0;
			let temp = this.root;
			iterator(temp, index);
			if (!temp)
				return;

			while(temp.next != null) {
				temp = <T>temp.next;
				index++;
				iterator(temp, index);
			}
		}

		public toJson(): any[] {
			let arr = [];
			this.forEach(function(node, i) {
				if(node && node.toJson){
					arr.push(node.toJson())
				}
			});
			return arr;
		}

		public toArray(): T[] {
			let arr = Array<T>();
			this.forEach(function(node, i) {
				arr.push(node);
			});
			return arr;
		}

		public getLast(): T {
			return this.last;
		}

		public getRoot(): T {
			return this.root;
		}

		public remove(guid: string): T {
			return;
		}

		public size(): number {
			return this._length;
		}	

		public hasElements(): boolean {
			return this.size() > 0;
		}

		public isEmpty(): boolean {
			return !this.hasElements();
		}
	}
}