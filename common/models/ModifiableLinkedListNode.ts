/// <reference path='./models.ts' />

module Common.Models {

	export class ModifiableLinkedListNode
	extends Common.Models.LinkedListNode<Common.Models.Modifiable> {
		
		constructor(
			data: any, 
			next:  Common.Models.ModifiableLinkedListNode, 
			prev?: Common.Models.ModifiableLinkedListNode
		) {
			super(data, next, prev);
		}

		public toJson(): any {
			return super.toJson();
		}
	}
}