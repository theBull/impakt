/// <reference path='./models.ts' />

module Common.Models {

	export class LinkedListNode<T extends Common.Models.Storable>
	extends Common.Models.Storable {

		public data: any;
		public next: LinkedListNode<T>;
		public prev: LinkedListNode<T>;
		

		constructor(data: any, next: LinkedListNode<T>, prev?: LinkedListNode<T>) {
			super();
			this.data = data;
			this.data.node = this;
			this.next = next;
			this.prev = prev || null;
		}

		public toJson(): any {
			return Common.Utilities.toJson(this.data);
		}
	}
}