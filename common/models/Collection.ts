/// <reference path='./models.ts' />

module Common.Models {

	export class Collection<T extends Common.Interfaces.IModifiable>
	extends Common.Models.Modifiable
	implements Common.Interfaces.ICollection<T> {
		
		private _count: number;
		private _keys: Array<string | number>;

		constructor(size?: number) {
			if (Common.Utilities.isNotNullOrUndefined(size) && size < 0)
				throw new Error('Collection constructor(): Cannot create a collection with size < 0');
			
			super();
			super.setContext(this);
			this._count = 0;
			this._keys = new Array(size || 0);
		}
		private _getKey(data: T) {
			if (data && data.guid) {
				return data.guid;
			}
			else {
				//throw new Error('Object does not have a guid');
				console.error('Object does not have a guid');
			}
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
		public hasElements(): boolean {
			return this.size() > 0;
		}
		public get(key: string | number): T {
			key = this._ensureKeyType(key);
			return this[key];
		}
		public exists(key: string | number): boolean {
			return this.contains(key);
		}
		public first(): T {
			return this.getOne();
		}
		public getOne(): T {
			return this[this._keys[0]];
		}
		public getIndex(index: number): T {
			return this.get(this._keys[index]);
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
		/**
		 * Retrieves the last element in the collection
		 * @return {T} [description]
		 */
		public getLast(): T {
			let key = this._keys[this._keys.length - 1];
			return this.get(key);
		}
		public set(key: string | number, data: T) {
			if (!this.hasOwnProperty(key.toString()))
				throw Error('Object does not have key ' + key + '. Use the add(key) method.');

			this[key] = data;
			
			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
		}
		public replace(replaceKey: string | number, data: T) {
			let key = this._getKey(data);
			this._keys[this._keys.indexOf(replaceKey)] = key;
			this[key] = data;
			delete this[replaceKey];

			let self = this;
			data.onModified(function() {
				self.setModified(true);
			});
			this.setModified(true);
		}
		public setAtIndex(index: number, data: T) {
			if (index < 0 || index > this._count - 1)
				throw new Error('Collection setAtIndex(): index is out of bounds; ' + index);

			let key = this._keys[index];
			if (Common.Utilities.isNullOrUndefined(key))
				return null;

			this.set(key, data);
		}
		public add(data: T) {
			let key = this._getKey(data);
			if(this[key] && this._keys.indexOf(key) > -1) {
				this.set(key, data);
			} else {
				this[key] = data;
				
				// NOTE:
				// Here, we must consider that since the collection can
				// be initialized with a given size, we don't want to just
				// arbitrarily 'push()' the added data on to the end of the
				// array; instead, we must use the internal _count variable
				// which keeps track of the actual number of elements in the
				// array, regardless of its initialized size, and always
				// add the new element at the index after the last-inserted
				// element.
				this._keys[this._count] = key;

				this._count++;	
				let self = this;
				data.onModified(function() {
					self.setModified(true);
				});
				this.setModified(true);
			}			

		}
		public addAll(...args: T[]) {
			if (!args)
				return;

			for (let i = 0; i < args.length; i++) {
				let item = args[i];
				if (item) {
					this.add(item);
				}
			}
		}
		public addAtIndex(data: T, index: number) {
			let key = this._getKey(data);

			let exists = this._keys.indexOf(key) > -1;
			if (!exists || this._keys.indexOf(key) == index) {
				// element exists at that index, update	
				// OR, element does not exist, add at index
				this[key] = data;
				this._keys[index] = key;

				if (!exists) {
					this._count++;

					let self = this;
					data.onModified(function() {
						self.setModified(true);
					});
					this.setModified(true);
				}
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
		public only(data: T): void {
			this.removeAll();
			this.add(data);
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
					if(this.clearListeners) {
						item.clearListeners();
					}
					self.add(item);	
				} else {
					throw new Error('item is null or does not have guid');
				}
			});
		}
		public forEach(iterator: Function): void {
			if (!this._keys)
				return;

			for (let i = 0; i < this._keys.length; i++) {
				let key = this._keys[i];
				iterator(this[key], i);
			}
		}
		public hasElementWhich(predicate: Function): boolean {
			return this.filterFirst(predicate) != null;
		}
		public filter(predicate: Function): T[] {
			let results = [];
			this.forEach(function(element: T, index) {
				if(predicate(element)) {
					results.push(element);
				}
			});
			return results;
		}
		public filterFirst(predicate: Function): T {
			let results = this.filter(predicate);
			return results && results.length > 0 ? results[0] : null;
		}
		public remove(key: string | number): T {
			if (!this[key]) {
				console.warn('Collection remove(): Tried to remove item, \
					but item with guid does not exist: ', key);
				return;
			}

			let obj = this[key];
			delete this[key];
			this._keys.splice(this._keys.indexOf(key), 1);

			this._count--;
			this.setModified(true);
			return obj;
		}
		public empty(): void {
			this.removeAll();
		}
		public removeAll(): void {
			while (this._count > 0) {
				let key = this._keys[0];
				this.remove(key);
			}
		}
		/**
		 * Allows you to run an iterator method over each item
		 * in the collection before the collection is completely
		 * emptied.
		 */
		public removeEach(iterator): void {
			// first, run the iterator over each item in the
			// collection
			this.forEach(iterator); 

			// now remove all of them
			this.removeAll();
		}
		public contains(key: string | number): boolean {
			return this[key] != null && this[key] != undefined;
		}
		public toArray(): T[] {
			let arr = [];
			for (var i = 0; i < this._keys.length; i++) {
				arr.push(this.get(this._keys[i]));
			}
			return arr;
		}
		public toJson(): any {
			let results = [];
			this.forEach(function(element, index) {
				results.push(element ? element.toJson() : null);
			});
			return results;
		}

		public getGuids(): Array<string | number> {
			return this._keys;
		}
	}
}