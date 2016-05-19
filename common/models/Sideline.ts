/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Sideline
    extends Common.Models.FieldElement {

        public offsetX: number;

        constructor(offsetX: number) {
            super();
            this.offsetX = offsetX;
        }

        public initialize(field: Common.Interfaces.IField): void {
            super.initialize(field, null);
            this.graphics.fill = 'white';
            this.graphics.strokeWidth = 0;
            this.graphics.updateFromCoordinates(
                this.offsetX,
                0
            );
            this.graphics.dimensions.width = this.grid.getSize();
            this.graphics.dimensions.height = this.grid.getHeight();
        }
        
        public draw(): void {
            this.graphics.rect();
        }
    }
}