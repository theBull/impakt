/// <reference path='../models.ts' />

module Playbook.Models {

    export class FieldElementSet 
    extends Playbook.Models.FieldElement {

        public context: Playbook.Interfaces.IFieldElement;
        public items: Playbook.Interfaces.IFieldElement[];
        public length: number;

        constructor(
            context: Playbook.Interfaces.IFieldElement, 
            ...args: Playbook.Interfaces.IFieldElement[]
        ) {
            super(context);
            this.context = context;
            this.items = [];
            this.raphael = this.context.paper.set();
            if (args && args.length > 0) {
                this.push.apply(this, args);
            }
            //console.log(this.items);
            this.length = this.items.length;
        }
        public size(): number {
            return this.items.length;
        };
        public push(...args: Playbook.Interfaces.IFieldElement[]) {
            for (var i = 0; i < args.length; i++) {
                this.length++;
                this.raphael.push(args[i].raphael);
                this.items.push(args[i]);
            }
        };
        public pop()
            : Playbook.Interfaces.IFieldElement 
        {
            this.length--;
            this.raphael.pop();
            return this.items.pop();
        };
        public exclude(element: Playbook.Interfaces.IFieldElement)
            : Playbook.Interfaces.IFieldElement 
        {
            this.length--;
            return this.raphael.exclude(element);
        };
        public forEach(callback: Function, context: any): any {
            return this.raphael.forEach(callback, context);
        };
        public getByGuid(guid: string)
            : Playbook.Interfaces.IFieldElement 
        {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item && item.guid && item.guid == guid)
                    return item;
            }
            return null;
        };
        public splice(index: number, count: number)
            : Playbook.Interfaces.IFieldElement[]
        {
            this.length -= count;
            this.raphael.splice(index, count);
            return this.items.splice(index, count);
        };
        public removeAll(): void {
            while (this.raphael.length > 0) {
                this.pop();
            }
        };
        public clear(): void {
            this.raphael.clear();
        };
        public dragOne(guid: string, dx: number, dy: number) {
            var item = this.getByGuid(guid);
            item.placement.coordinates.dx = dx;
            item.placement.coordinates.dy = dy;
            item.raphael.transform(['t', dx, ', ', dy].join(''));
        };
        public dragAll(dx: number, dy: number): void {
            //console.log('dragging ' + this.length + ' items');
            // for each item in the set, update its drag position
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                item.placement.coordinates.dx = dx;
                item.placement.coordinates.dy = dy;
            }
            this.raphael.transform(['t', dx, ', ', dy].join(''));
        };
        public drop(): void {
            this.raphael.transform(['t', 0, ', ', 0].join(''));
            // iterate over each item and update its final position
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                item.drop();
            }
        };
        public setOriginalPositions() {
            // for each item in the set, update its drag position
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                item.placement.coordinates.ax = item.placement.coordinates.ax;
                item.placement.coordinates.ay = item.placement.coordinates.ay;
            }
        };
    }
}

