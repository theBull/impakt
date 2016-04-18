/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Hashmark
    extends Common.Models.FieldElement {

        public start: number;
        public yards: number;

        constructor(field: Common.Interfaces.IField, x: number) {
            super(field, null);

            // hash marks should be -x- grid units from center
            this.layer.type = Common.Enums.LayerTypes.Hashmark;
            this.layer.graphics.dimensions.offset.x = -0.25 * this.grid.getSize();
            this.layer.graphics.placement.coordinates.x = x;
            this.start = 11;
            this.yards = 110;
        }
        public draw(): void {
            let hashmarkWidth = this.grid.getSize() / 2;

            for (let i = this.start; i < this.yards; i++) {
                let hashmark = this.paper.drawing.rect(
                    this.layer.graphics.placement.coordinates.x,
                    i,
                    hashmarkWidth,
                    1,        
                    false,
                    this.layer.graphics.dimensions.offset.x,
                    0
                ).attr({
                    'fill': 'white',
                    'stroke-width': 0
                });
            }
        }
    }
}