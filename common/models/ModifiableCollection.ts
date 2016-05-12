/// <reference path='./models.ts' />

module Common.Models {

	export class ModifiableCollection<T extends Common.Models.Modifiable> {
		
		public callbacks: Function[];
		public modified: boolean;
		public checksum: string;
		public original: string;
		public lastModified: number;
		public context: any;
		public isContextSet: boolean;
		public listening: boolean;

		private _modifiable: Common.Models.Modifiable;
		private _collection: Common.Models.Collection<T>;
		public guid: string;

		constructor(size?: number) {
			this._modifiable = new Common.Models.Modifiable();
			this._modifiable.setContext(this);

			this.callbacks = this._modifiable.callbacks;
			this.modified = this._modifiable.modified;
			this.lastModified = this._modifiable.lastModified;
			this.original = this._modifiable.original;
			this.checksum = this._modifiable.checksum;
			this.context = this._modifiable.context;
			this.isContextSet = this._modifiable.isContextSet;
			this.listening = this._modifiable.listening;
			
			this._collection = new Common.Models.Collection<T>(size);
			this.guid = this._modifiable.guid;
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
			this._collection.forEach(function(modifiableItem, index) {
				if (Common.Utilities.isNullOrUndefined(modifiableItem))
					return;
				
				modifiableItem.onModified(function() {
					// child elements modified, 
					// propegate changes up to the parent
					self.isModified();
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
		public size(): number {
			return this._collection.size();
		}
		public isEmpty(): boolean {
			return this._collection.isEmpty();
		}
		public hasElements(): boolean {
			return this._collection.hasElements();
		}
		public exists(key: string | number): boolean {
			return this._collection.exists(key);
		}
		public get(key: string | number): T {
			return this._collection.get(key);
		}
		public first(): T {
			return this._collection.first();
		}
		public getOne(): T {
			return this._collection.getOne();
		}
		public getIndex(index: number): T {
			return this._collection.getIndex(index);
		}
		public set(key: string | number, data: T) {
			this._collection.set(key, data);

			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
			return this;
		}
		public replace(replaceKey: string | number, data: T) {
			this._collection.replace(replaceKey, data);

			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
			return this;
		}
		public setAtIndex(index: number, data: T) {
			this._collection.setAtIndex(index, data);

			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
			return this;
		}
		public add(data: T) {
			this._collection.add(data);

			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
			return this;
		}
		public addAll(...args: T[]) {
			if (!args || args.length == 0)
				return this;

			this._collection.addAll(...args);

			let self = this;
			for (let i = 0; i < args.length; i++) {
				let modifiable = args[i];
				modifiable.onModified(function() {
					self.setModified(true);
				});
			}

			this.setModified(true);
			return this;
		}
		public addAtIndex(data: T, index: number) {
			this._collection.addAtIndex(data, index);

			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
			return this;
		}
		public only(data: T) {
			this._collection.only(data);

			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
			return this;
		}
		public append(collection: Common.Models.Collection<T>, clearListeners?: boolean) {
			this._collection.append(collection);

			let self = this;
			collection.forEach(function(modifiable: Common.Models.Modifiable, index: number) {
				// clear any existing listeners from the
				// items in the appended collection and
				// re-register new listeners
				if(clearListeners)
					modifiable.clearListeners();

				modifiable.onModified(function() {
					self.setModified(true);
				});
			});
			this.setModified(true);
			return this;
		}
		public forEach(iterator: Function): void {
			this._collection.forEach(iterator);
		}
		public hasElementWhich(predicate: Function): boolean {
			return this._collection.hasElementWhich(predicate);
		}
		public filter(predicate: Function): T[] {
			return this._collection.filter(predicate);
		}
		public filterFirst(predicate: Function): T {
			return this._collection.filterFirst(predicate);
		}
		public remove(key: string | number): T {
			let results = this._collection.remove(key); 
			this.setModified(true);

			return results;
		}
		public removeAll(): void {
			this._collection.removeAll();
			this.setModified(true);
		}
		public empty(): void {
			this.removeAll();
		}
		/**
		 * Allows you to run an iterator method over each item
		 * in the collection before the collection is completely
		 * emptied.
		 */
		public removeEach(iterator): void {
			this._collection.removeEach(iterator);
			this.setModified(true);
		}
		public contains(key: string | number): boolean {
			return this._collection.contains(key);
		}
		public getAll(): { any?: T } {
			return this._collection.getAll();
		}

		public getLast(): T {
			return this._collection.getLast();
		}
		public toArray(): T[] {
			return this._collection.toArray();
		}
		
		public toJson(): any {
			return this._collection.toJson();
		}

		public fromJson(json): void {
			if (!json)
				return;
			
			this._collection.fromJson(json._collection);
		}

		public copy(
			newElement: Common.Models.ModifiableCollection<T>,
			context: Common.Models.ModifiableCollection<T>
		): Common.Models.ModifiableCollection<T> {
			console.error('ModifiableCollection copy() not implemented');
			return null;
		}

		public getGuids(): Array<string | number> {
			return this._collection.getGuids();
		}

	}
}