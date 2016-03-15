/// <reference path='./models.ts' />

module Common.Models {

	export class Collection<T extends Common.Models.Storable>
	extends Common.Models.Storable {
		
		private _count: number;
		private _keys: Array<string | number>;

		constructor() {
			super();
			this._count = 0;
			this._keys = [];
		}
		private _ensureKeyType(key: string | number) {
			if (typeof key == 'string') {
				// could be valid string 'foo' or number hidden as string '2'
				// convert '2' to 2
				let k = key.toString();
				let ki = parseInt(k);

				key = isNaN(ki) || k.indexOf('-') > -1 ? k : ki;
			}
			return key;
		}
		public size(): number {
			return this._count;
		}
		public isEmpty(): boolean {
			return this.size() == 0;
		}
		public get<T>(key: string | number): T {
			key = this._ensureKeyType(key);
			return this[key];
		}
		public getOne<T>(): T {
			return this[this._keys[0]];
		}
		public getIndex(index: number): T {
			return this.get<T>(this._keys[index]);
		}
		public set<T>(key: string | number, data: T) {
			if (!this.hasOwnProperty(key.toString()))
				throw Error('Object does not have key ' + key + '. Use the add(key) method.');

			this[key] = data;
			this._keys.push(key);
		}
		public replace<T>(replaceKey: string | number, key: string | number, data: T) {
			this._keys[this._keys.indexOf(replaceKey)] = key;
			this[key] = data;

			delete this[replaceKey];
		}
		public setAtIndex<T>(index: number, data: T) {

		}
		public add<T>(key: string | number, data: T) {
			if(this[key] && this._keys.indexOf(key) > -1) {
				this.set(key, data);
			} else {
				this[key] = data;
				this._keys.push(key);
				this._count++;	
			}			
		}
		public addAtIndex(key: string | number, data: T, index: number) {

			let exists = this._keys.indexOf(key) > -1;
			if (!exists || this._keys.indexOf(key) == index) {
				// element exists at that index, update	
				// OR, element does not exist, add at index
				this[key] = data;
				this._keys[index] = key;

				if (!exists)
					this._count++;
			} else {
				// element exists at different index...
				// ignore for now...
				let currentIndex = this._keys.indexOf(key);
				throw new Error([
					'The element you want to add at this',
					' index already exists at index (',
					currentIndex,
					'). Ignoring for now...'
				].join(''));
			}
		}
		public append(collection: Common.Models.Collection<T>) {
			// adds the given collection onto the end of this collection
			// E.g.
			// this -> [1, 2, 3]
			// collection -> [4, 5, 6]
			// this.append(collection) -> [1, 2, 3, 4, 5, 6]
			let self = this;
			collection.forEach(function(item: T, index) {
				if(item && item.guid) {
					self.add(item.guid, item);	
				} else {
					throw new Error('item is null or does not have guid');
				}
			});
		}
		public forEach<T>(iterator: Function): void {
			if (!this._keys)
				return;

			for (let i = 0; i < this._keys.length; i++) {
				let key = this._keys[i];
				iterator(this[key], i);
			}
		}
		public filter<T>(predicate: Function): T[] {
			let results = [];
			this.forEach(function(element: T, index) {
				if(predicate(element)) {
					results.push(element);
				}
			});
			return results;
		}
		public filterFirst<T>(predicate: Function): T {
			let results = this.filter<T>(predicate);
			return results && results.length > 0 ? results[0] : null;
		}
		public remove<T>(key: string | number): T {
			if (!this[key])
				throw Error('Object at key ' + key + ' does not exist');

			let obj = this[key];
			delete this[key];
			this._keys.splice(this._keys.indexOf(key), 1);

			this._count--;
			return obj;
		}
		public removeAll<T>(): void {
			while (this._count > 0) {
				let key = this._keys[0];
				this.remove(key);
				console.log('removing key', key);
			}
		}
		/**
		 * Allows you to run an iterator method over each item
		 * in the collection before the collection is completely
		 * emptied.
		 */
		public removeEach<T>(iterator): void {
			// first, run the iterator over each item in the
			// collection
			this.forEach(iterator); 

			// now remove all of them
			this.removeAll();
		}
		public contains<T>(key: string | number): boolean {
			return this[key] != null && this[key] != undefined;
		}
		public getAll(): { any?: T } {
			let obj = {};
			for (let i = 0; i < this._keys.length; i++) {
				let key = this._keys[i];				
				// shitty way of hiding private properties
				obj[key] = this.get(key);
			}
			return obj;
		}

		public getLast<T>(): T {
			let key = this._keys[this._keys.length - 1];
			return this.get<T>(key);
		}
		public toArray<T>(): T[] {
			let arr = [];
			for (var i = 0; i < this._keys.length; i++) {
				arr.push(this.get(this._keys[i]));
			}
			return arr;
		}

		public toJsonArray(): any[] {
			let results = [];
			this.forEach(function(element, index) {
				results.push(Common.Utilities.toJson(element));
			});
			return results;
		}
		/**
		 * Alias for toJsonArray, since the collection should be
		 * represented as an array
		 * @return {any} returns an array of objects
		 */
		public toJson(): any {
			return this.toJsonArray();
		}
	}
}