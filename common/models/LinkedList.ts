/// <reference path='./models.ts' />

module Common.Models {

	export class LinkedList<T extends Common.Models.Storable> 
		extends Common.Models.Storable {

		public root: Common.Models.LinkedListNode<T>;
		public last: Common.Models.LinkedListNode<T>;
		private _length: number;

		constructor() {
			super();
			this.root = null;
			this.last = null;
			this._length = 0;
		}

		public add(node: Common.Models.LinkedListNode<T>) {
			if (!this.root) {
				this.root = node;
				this.root.prev = null;
			} else {
				let temp = this.root;
				while (temp.next != null) {
					temp = temp.next;
				}
				node.prev = temp;
				temp.next = node;
			}
			this.last = node;

			this._length++;
		}

		public getIndex(index: number): Common.Models.LinkedListNode<T> {
			let count = 0;
			let temp = this.root;
			if (!temp)
				return null;

			while (temp) {
				if (count == index)
					return temp;

				if (temp.next) {
					temp = temp.next;
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
				temp = temp.next;
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
				else {
					throw new Error('node data is null or toJson not implemented');
					arr.push(null);
				}

			});
			return arr;
		}

		public toDataArray<T>(): T[] {
			let arr = Array<T>();
			this.forEach(function(node, i) {
				arr.push(node.data);
			});
			return arr;
		}

		public toArray(): Common.Models.LinkedListNode<T>[] {
			let arr = Array<Common.Models.LinkedListNode<T>>();
			this.forEach(function(node, i) {
				arr.push(node);
			});
			return arr;
		}

		public getLast(): Common.Models.LinkedListNode<T> {
			return this.last;
		}

		public remove(guid: string): Common.Models.LinkedListNode<T> {
			throw Error('not implemented');
		}

		public size(): number {
			return this._length;
		}	

		public hasElements(): boolean {
			return this.size() > 0;
		}	
	}
}