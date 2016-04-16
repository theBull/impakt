/// <reference path='./models.ts' />

module Common.Models {
    
    export abstract class Endzone
    extends Common.Models.FieldElement {

        constructor(
            context: Common.Interfaces.IField, 
            offsetY: number
        ) {
            super(context, null);
            this.layer.type = Common.Enums.LayerTypes.Endzone;
            this.layer.graphics.fill = 'black';
            this.layer.graphics.setOpacity(0.25);
            this.layer.graphics.updateFromCoordinates(1, offsetY);
            this.layer.graphics.dimensions.setWidth(this.paper.getWidth() - (2 * this.grid.getSize()));
            this.layer.graphics.dimensions.setHeight(10 * this.grid.getSize());
        }
        public draw(): void {
            this.layer.graphics.rect();
        }
    }
}