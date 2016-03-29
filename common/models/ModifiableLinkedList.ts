/// <reference path='./models.ts' />

module Common.Models {

	export class ModifiableLinkedList<T extends Common.Models.Modifiable>
	extends Common.Models.LinkedList<T> {

		private _modifiable: Common.Models.Modifiable;

		constructor() {
			super();
			this._modifiable = new Common.Models.Modifiable(this);
		}	

		public add(node: Common.Models.LinkedListNode<T>) {
			super.add(node);
			this._modifiable.setModified();
		}

		public getIndex(index: number): Common.Models.LinkedListNode<T> {
			return super.getIndex(index);
		}

		public forEach(iterator: Function): void {
			super.forEach(iterator);
		}

		public toJson(): any[] {
			return super.toJson();
		}

		public toDataArray<T>(): T[] {
			return super.toDataArray<T>();
		}

		public toArray(): Common.Models.LinkedListNode<T>[] {
			return super.toArray();
		}

		public getLast(): Common.Models.LinkedListNode<T> {
			return super.getLast();
		}

		public remove(guid: string): Common.Models.LinkedListNode<T> {
			let results = super.remove(guid);
			this._modifiable.setModified();
			return results;
		}

		public size(): number {
			return super.size();
		}

		public hasElements(): boolean {
			return super.hasElements();
		}	
	}
}