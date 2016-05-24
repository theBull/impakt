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
            this.graphics.initializePlacement(
                new Common.Models.Placement(
                    this.offsetX, 
                    0,
                    null
                )
            );
            this.graphics.dimensions.width = this.grid.getSize();
            this.graphics.dimensions.height = this.grid.getHeight();
        }
        
        public draw(): void {
            this.graphics.rect();
        }
    }
}