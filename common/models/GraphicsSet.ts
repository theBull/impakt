/// <reference path='./models.ts' />

module Common.Models {

    export class GraphicsSet {

        public context: Common.Models.Graphics;
        public canvas: Common.Interfaces.ICanvas;
        public grid: Common.Interfaces.IGrid;
        public items: Common.Models.Graphics[];
        public length: number;
        public raphaelSet: any;

        constructor(
            context: Common.Models.Graphics, 
            ...args: Common.Models.Graphics[]
        ) {
            this.context = context;
            this.canvas = this.context.canvas;
            this.grid = this.canvas.grid;
            this.items = [];
            this.raphaelSet = this.canvas.drawing.set();

            if (args && args.length > 0) {
                this.push.apply(this, args);
            }

            //console.log(this.items);
            this.length = this.items.length;
        }
        
        public size(): number {
            return this.items.length;
        }

        public push(...args: Common.Models.Graphics[]) {
            for (let i = 0; i < args.length; i++) {
                let graphics = args[i];
                if(Common.Utilities.isNullOrUndefined(graphics))
                    continue;
                
                this.length++;
                this.raphaelSet.exclude(graphics.raphael);
                this.raphaelSet.push(graphics.raphael);
                this.items.push(graphics);
            }
        }

        public empty(): void {
            while(this.length > 0) {
                this.pop();
            }
        }

        public pop(): Common.Models.Graphics {
            this.length--;
            this.raphaelSet.pop();
            return this.items.pop();
        }

        public exclude(graphics: Common.Models.Graphics): Common.Models.Graphics {           
            let matchingGraphics = this.getByGuid(graphics.guid);
            if (!matchingGraphics)
                throw new Error('GraphicsSet exclude(): no matching graphics found for exclusion');

            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (item.guid == matchingGraphics.guid) {
                    this.splice(i, 1);
                    this.length--;
                    break;
                }
            }
            return this.raphaelSet.exclude(matchingGraphics.raphael);
        }

        public forEach(iterator: Function, context: any): any {
            return this.raphaelSet.forEach(iterator, context);
        }

        public getByGuid(guid: string): Common.Models.Graphics {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (item && item.guid && item.guid == guid)
                    return item;
            }
            return null;
        }

        public splice(index: number, count: number): Common.Models.Graphics[] {
            this.length -= count;
            this.raphaelSet.splice(index, count);
            return this.items.splice(index, count);
        }

        public removeAll(): void {
            while (this.raphaelSet.length > 0) {
                this.pop();
            }
            this.items = [];
            this.length = 0;
        }

        public dragOne(guid: string, dx: number, dy: number) {
            let graphics = this.getByGuid(guid);
            graphics.moveByDelta(dx, dy);
        }

        public dragAll(dx: number, dy: number): void {
            //console.log('dragging ' + this.length + ' items');
            // for each item in the set, update its drag position
            for (let i = 0; i < this.items.length; i++) {
                let graphics = this.items[i];
                graphics.moveByDelta(dx, dy);
            }
        }

        public show(): void {
            this.raphaelSet.show();
        }

        public hide(): void {
            this.raphaelSet.hide();
        }

        public drop(): void {
            // iterate over each item and update its final position
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                item.drop();
            }
        }
        public setOriginalPositions() {
            // for each item in the set, update its drag position
            for (let i = 0; i < this.items.length; i++) {
                let graphics = this.items[i];
                graphics.location.ax = graphics.location.ox;
                graphics.location.ay = graphics.location.oy;
            }
        }
    }
}

