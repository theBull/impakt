/// <reference path='./models.ts' />

module Common.Models {

	export class ModifiableCollection<T extends Common.Models.Modifiable>
		extends Common.Models.Collection<T>
		implements Common.Interfaces.IModifiable {
		
		private _modifiable: Common.Models.Modifiable;

		constructor() {
			super();
			this._modifiable = new Common.Models.Modifiable(this);
		}
		public setModified(): boolean {
			return this._modifiable.setModified();
		}
		public onModified(callback: Function): void {
			this._modifiable.onModified(callback);
		}
		public isModified(): void {
			this._modifiable.isModified();
		}
		public size(): number {
			return super.size();
		}
		public isEmpty(): boolean {
			return super.isEmpty();
		}
		public get<T>(key: string | number): T {
			return super.get<T>(key);
		}
		public getOne<T>(): T {
			return super.getOne<T>();
		}
		public getIndex(index: number): T {
			return super.getIndex(index);
		}
		public set<T>(key: string | number, data: T) {
			super.set<T>(key, data);
			this._modifiable.setModified();
		}
		public replace<T>(replaceKey: string | number, key: string | number, data: T) {
			super.replace<T>(replaceKey, key, data);
			this._modifiable.setModified();
		}
		public setAtIndex<T>(index: number, data: T) {
			super.setAtIndex<T>(index, data);
			this._modifiable.setModified();
		}
		public add<T>(key: string | number, data: T) {
			super.add<T>(key, data);
			this._modifiable.setModified();
		}
		public addAtIndex(key: string | number, data: T, index: number) {
			super.addAtIndex(key, data, index);
			this._modifiable.setModified();
		}
		public append(collection: Common.Models.Collection<T>) {
			super.append(collection);
			this._modifiable.setModified();
		}
		public forEach<T>(iterator: Function): void {
			super.forEach<T>(iterator);
		}
		public filter<T>(predicate: Function): T[] {
			return super.filter<T>(predicate);
		}
		public filterFirst<T>(predicate: Function): T {
			return super.filterFirst<T>(predicate);
		}
		public remove<T>(key: string | number): T {
			let results = super.remove<T>(key); 
			this._modifiable.setModified();
			return results;
		}
		public removeAll<T>(): void {
			super.removeAll<T>(); 
			this._modifiable.setModified();
		}
		/**
		 * Allows you to run an iterator method over each item
		 * in the collection before the collection is completely
		 * emptied.
		 */
		public removeEach<T>(iterator): void {
			super.removeEach<T>(iterator); 
			this._modifiable.setModified();
		}
		public contains<T>(key: string | number): boolean {
			return super.contains<T>(key);
		}
		public getAll(): { any?: T } {
			return super.getAll();
		}

		public getLast<T>(): T {
			return super.getLast<T>();
		}
		public toArray<T>(): T[] {
			return super.toArray<T>();
		}

		public toJsonArray(): any[] {
			return super.toJsonArray();
		}
		
		public toJson(): any {
			return super.toJson();
		}

	}
}