/// <reference path='../models.ts' />

module Playbook.Models {
	export class FieldElementSet 
		extends Playbook.Models.FieldElement {

		public items: Array<FieldElement>;
		public length: number;

		constructor(context: any, ...args: FieldElement[]) {
			super(context);

			this.context = context;
			this.items = [];
			this.raphael = this.context.paper.set();
			
			if(args && args.length > 0) {
				this.push(...args);
			}
			//console.log(this.items);

			this.length = this.items.length;
		}

		public size() {
			return this.items.length;
		}

		public push(...args: FieldElement[]) {
			for (var i = 0; i < args.length; i++) {
				this.length++;

				this.raphael.push(args[i].raphael);
				
				this.items.push(args[i]);
			}
		}

		public pop(): FieldElement {
			this.length--;
			this.raphael.pop();
			return this.items.pop();
		}

		public exclude(element: FieldElement) {
			this.length--;
			return this.raphael.exclude(element);
		}

		public forEach(callback: any, context: any) {
			return this.raphael.forEach(callback, context);
		}

		public getByGuid(guid: string): Playbook.Models.FieldElement {
			for (let i = 0; i < this.items.length; i++) {
				let item = this.items[i];
				if (item && item.guid && item.guid == guid)
					return item;
			}
			return null;
		}

		public splice(index: number, count: number) {
			this.length -= count;
			this.raphael.splice(index, count);
			return this.items.splice(index, count);
		}

		public removeAll() {
			while(this.raphael.length > 0) {
				this.pop();
			}
		}

		public clear() {
			this.raphael.clear();
		}

		public dragOne(guid: string, dx: number, dy: number) {
			let item = this.getByGuid(guid);
			item.dx = dx;
			item.dy = dy;
			item.raphael.transform(['t', dx, ', ', dy].join(''));
		}

		public dragAll(dx: number, dy: number) {
			//console.log('dragging ' + this.length + ' items');
			// for each item in the set, update its drag position
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];

				item.dx = dx;
				item.dy = dy;

			}			
		
			this.raphael.transform(['t', dx, ', ', dy].join(''));
		}

		public drop() {
			this.raphael.transform(['t', 0, ', ', 0].join(''));
			// iterate over each item and update its final position
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];
				item.drop();
			}
		}

		public setOriginalPositions() {
			// for each item in the set, update its drag position
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];

				item.ax = item.ax;
				item.ay = item.ay;
			}	
		}

	}
}