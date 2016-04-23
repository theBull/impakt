/// <reference path='./models.ts' />

module Common.Models {

    export abstract class Ground
    extends Common.Models.FieldElement {

        constructor(field: Common.Interfaces.IField) {
            super(field, null);

            this.layer.graphics.selectable = false;
            this.layer.graphics.updateFromCoordinates(
                    this.paper.x,
                    this.paper.y
            );
            this.layer.graphics.dimensions.setWidth(this.grid.dimensions.width + 2);
            this.layer.graphics.dimensions.setHeight(this.grid.dimensions.height + 2);
            this.layer.graphics.setOriginalOpacity(1);
            this.layer.graphics.setOriginalStrokeWidth(0);
            this.layer.graphics.setOriginalFill(Playbook.Constants.FIELD_COLOR);
        }
        public draw(): void {
            this.layer.graphics.rect();

            this.layer.graphics.onclick(
                this.click, 
                this
            );
        }
        public click(e: any): void {
            // Do nothing
            console.log('ground clicked');
        }
        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            // create selection box
        }
        public dragStart(x: number, y: number, e: any): void {
            this.layer.graphics.dragging = true;
            console.log('ground drag start');
        }
        public dragEnd(e: any): void {
            this.layer.graphics.dragging = false;
            console.log('ground drag end');
        }

        public getClickCoordinates(offsetX: number, offsetY: number): Common.Models.Coordinates {
            return this.grid.getCoordinatesFromAbsolute(
                this.layer.graphics.dimensions.offset.x - Math.abs(this.paper.x), 
                Math.abs(this.paper.y) + this.layer.graphics.dimensions.offset.y
            );
        }
    }
}
