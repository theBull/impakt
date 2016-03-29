/// <reference path='./models.ts' />

module Common.Models {

	export class ModifiableCollection<T extends Common.Models.Modifiable>
		implements Common.Interfaces.IModifiable {
		
		private _modifiable: Common.Models.Modifiable;
		private _collection: Common.Models.Collection<T>;
		public guid: string;

		constructor() {
			this._modifiable = new Common.Models.Modifiable(this);
			this._collection = new Common.Models.Collection<T>();
			this.guid = this._modifiable.guid;
		}
		public setModified(forciblyModify?: boolean): boolean {
			return this._modifiable.setModified(forciblyModify === true);
		}
		public onModified(callback: Function): void {
			let self = this;
			this._modifiable.onModified(callback);
			this._collection.forEach(function(modifiableItem, index) {
				modifiableItem.onModified(function() {
					// child elements modified, 
					// propegate changes up to the parent
					self.isModified();
				});
			});
		}
		public isModified(): void {
			this._modifiable.isModified();
		}
		/**
		 * When commanding the collection whether to listen, 
		 * apply the true/false argument to all of its contents as well
		 * @param {boolean} startListening true to start listening, false to stop
		 */
		public listen(startListening: boolean) {
			
			this._modifiable.listening = startListening;
			
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
			this._modifiable.setModified();
			return this;
		}
		public replace(replaceKey: string | number, data: T) {
			this._collection.replace(replaceKey, data);
			this._modifiable.setModified();
			return this;
		}
		public setAtIndex(index: number, data: T) {
			this._collection.setAtIndex(index, data);
			this._modifiable.setModified();
			return this;
		}
		public add(data: T) {
			this._collection.add(data);
			this._modifiable.setModified();
			return this;
		}
		public addAll(...args: T[]) {
			this._collection.addAll(...args);
			this._modifiable.setModified();
			return this;
		}
		public addAtIndex(data: T, index: number) {
			this._collection.addAtIndex(data, index);
			this._modifiable.setModified();
			return this;
		}
		public append(collection: Common.Models.Collection<T>) {
			this._collection.append(collection);
			this._modifiable.setModified();
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
			this._modifiable.setModified();
			return results;
		}
		public removeAll(): void {
			this._collection.removeAll(); 
			this._modifiable.setModified();
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
			this._modifiable.setModified();
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

		public copy(
			newElement: Common.Models.ModifiableCollection<T>,
			context: Common.Models.ModifiableCollection<T>
		): Common.Models.ModifiableCollection<T> {
			console.error('ModifiableCollection copy() not implemented');
			return null;
		}

	}
}