/// <reference path='./models.ts' />

module Common.Models {

    export abstract class Ground
    extends Common.Models.FieldElement {

        constructor() {
            super();
        }

        public initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement) {
            super.initialize(field, null);
            this.selectable = false;
            this.graphics.updateFromCoordinates(
                this.paper.x,
                this.paper.y
            );
            this.graphics.dimensions.setWidth(this.grid.dimensions.width + 2);
            this.graphics.dimensions.setHeight(this.grid.dimensions.height + 2);
            this.graphics.setOriginalOpacity(1);
            this.graphics.setOriginalStrokeWidth(0);
            this.graphics.setOriginalFill(Playbook.Constants.FIELD_COLOR);
        }


        public draw(): void {
            this.graphics.rect();

            this.graphics.onclick(
                this.click, 
                this
            );
        }
        public click(e: any): void {
            // Do nothing
            console.log('ground clicked');
        }

        public getClickCoordinates(offsetX: number, offsetY: number): Common.Models.Coordinates {
            let absCoords = this.getClickAbsolute(offsetX, offsetY);
            return this.grid.getCoordinatesFromAbsolute(absCoords.x, absCoords.y);
        }

        public getClickAbsolute(offsetX: number, offsetY: number): Common.Models.Coordinates {
            return new Common.Models.Coordinates(
                offsetX + this.graphics.dimensions.offset.x - Math.abs(this.paper.x),
                offsetY + Math.abs(this.paper.y) + this.graphics.dimensions.offset.y
            );
        }
    }
}
