/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Hashmark
    extends Common.Models.FieldElement {

        public offsetX: number;
        public start: number;
        public yards: number;

        constructor(offsetX: number) {
            super();
            this.offsetX = offsetX;
        }

        public initialize(field: Common.Interfaces.IField): void {
            super.initialize(field, null);
            // hash marks should be -x- grid units from center
            this.layer.type = Common.Enums.LayerTypes.Hashmark;
            this.graphics.dimensions.offset.x = -0.25 * this.grid.getSize();
            this.graphics.dimensions.offset.y = 0;
            this.graphics.placement.coordinates.x = this.offsetX;
            this.start = 11;
            this.yards = 110;
        }

        public draw(): void {
            let hashmarkWidth = this.grid.getSize() / 2;

            for (let i = this.start; i < this.yards; i++) {
                let hashmark = this.paper.drawing.rect(
                    this.graphics.placement.coordinates.x,
                    i,
                    hashmarkWidth,
                    1,        
                    false,
                    this.graphics.dimensions.offset.x,
                    0
                ).attr({
                    'fill': 'white',
                    'stroke-width': 0
                });
            }
        }
    }
}