module Common.Models {
	export class AssociationArray
	extends Common.Models.Modifiable {

		private _array: string[];

		constructor() {
			super();
			super.setContext(this);
			this._array = [];
		}

		public size(): number {
			return this._array.length;
		}
		public add(guid: string) {
			this._array.push(guid);
		}
		public addAll(guids: string[]) {
			this._array.concat(guids);
		}
		public addAtIndex(guid: string, index: number) {
			this._array[index] = guid;
		}
		public primary(): string {
			return this.getAtIndex(0);
		}
		public getAtIndex(index: number): string {
			return this._array[index];
		}
		public first(guid: string) {
			this.addAtIndex(guid, 0);
		}
		public only(guid: string) {
			this._array = [];
			this.add(guid);
		}
		public empty() {
			this._array = [];
		}
		public remove(guid: string): string {
			if(this.exists(guid)) {
				this._array.splice(this._array.indexOf(guid), 1);
				return guid;
			} else {
				throw new Error(['Association does not exist: ', guid].join(''));
				return null;
			}
		}

		/**
		 * Returns whether the given guid exists 
		 * @param  {string}  guid the guid to check
		 * @return {boolean}      true if it exists, otherwise false
		 */
		public exists(guid: string): boolean {
			return this.hasElements() && this._array.indexOf(guid) > -1;
		}

		/**
		 * Returns whether the array has elements
		 * @return {boolean} true or false
		 */
		public hasElements(): boolean {
			return this.size() > 0;
		}

		/**
		 * Replaces guid1, if found, with guid2
		 * @param  {string} guid1 guid to be replaced
		 * @param  {string} guid2 guid to replace with
		 */
		public replace(guid1: string, guid2: string): void {
			if(this.exists(guid1)) {
				this._array[this._array.indexOf(guid1)] = guid2;
			}
		}

		/**
		 * Iterates over each element in the array
		 * @param {Function} iterator the iterator function to call per element
		 */
		public forEach(iterator: Function): void {
			for (let i = 0; i < this._array.length; i++) {
				let guid = this._array[i];
				iterator(guid, i);
			}
		}

		public toArray(): any {
			return this._array;	
		}

		public toJson(): any {
			return this.toArray();
		}

		public fromJson(json: any) {
			this._array = json;
		}
	}
}