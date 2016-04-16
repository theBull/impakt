/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Sideline
    extends Common.Models.FieldElement {

        constructor(field: Common.Interfaces.IField, x: number) {
            super(field, null);
            this.field = field;
            this.layer.graphics.fill = 'white';
            this.layer.graphics.strokeWidth = 0;
            this.layer.graphics.updateFromCoordinates(
                x,
                0
            );
            this.layer.graphics.dimensions.width = this.grid.getSize();
            this.layer.graphics.dimensions.height = this.grid.getHeight();
        }
        
        public draw(): void {
            this.layer.graphics.rect();
        }
    }
}