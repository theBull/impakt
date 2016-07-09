/// <reference path='./models.ts' />

module Common.Models {
    
    export abstract class Endzone
    extends Common.Models.FieldElement {

        public offsetY: number;

        constructor(offsetY: number) {
            super();
            this.offsetY = offsetY;
        }

        public initialize(field: Common.Interfaces.IField) {
            super.initialize(field, null);
            this.layer.type = Common.Enums.LayerTypes.Endzone;
            this.graphics.fill = 'black';
            this.graphics.setOpacity(0.25);
            this.graphics.initializePlacement(
                new Common.Models.Placement(
                    1, 
                    this.offsetY,
                    null
                )
            );
            this.graphics.dimensions.setWidth(this.canvas.getWidth() - (2 * this.grid.getSize()));
            this.graphics.dimensions.setHeight(10 * this.grid.getSize());
        }

        public draw(): void {
            this.graphics.rect();
        }
    }
}