/// <reference path='../models.ts' />

module Playbook.Models {

    export class Ground
        extends Playbook.Models.FieldElement {

        public offset: Playbook.Models.Coordinates;

        constructor(field: Playbook.Interfaces.IField) {
            super(field);
            this.field = field;
            this.offset = new Playbook.Models.Coordinates(0, 0);

            this.placement = new Playbook.Models.Placement(0, 0, null);
            this.placement.coordinates.x = this.paper.x - 1;
            this.placement.coordinates.y = this.paper.y - 1;
            this.width = this.grid.width + 2;
            this.height = this.grid.height + 2;
            this.opacity = 1;
            this.clickable = true;
            this.color = Playbook.Constants.FIELD_COLOR;
        }
        public draw(): void {
            let self = this;
            this.raphael = this.paper.Raphael.rect(
                this.placement.coordinates.x, 
                this.placement.coordinates.y, 
                this.width, 
                this.height + 2
            ).attr({
                x: self.placement.coordinates.x,
                y: self.placement.coordinates.y,
                width: self.width + 2,
                height: self.height + 2,
                stroke: '#000000',
                fill: this.color,
                opacity: self.opacity
            });
            this.raphael.click(this.click, this);
            this.raphael.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this);
        };
        public getClickCoordinates(offsetX: number, offsetY: number): Playbook.Models.Coordinates {
            this.setOffset(offsetX, offsetY);
            return this.grid.getCoordinatesFromAbsolute(
                this.getOffsetX() - Math.abs(this.paper.x), 
                Math.abs(this.paper.y) + this.getOffsetY()
            );
        };
        public click(e: any): void {
            let coords = this.getClickCoordinates(e.offsetX, e.offsetY);
            let toolMode = this.paper.canvas.toolMode;
            switch (toolMode) {
                case Playbook.Editor.ToolModes.Select:
                    console.log('selection mode');
                    this.field.deselectAll();
                    break;
                case Playbook.Editor.ToolModes.None:
                    console.log('no mode');
                    this.field.deselectAll();
                    break;
                case Playbook.Editor.ToolModes.Assignment:
                    this.field.useAssignmentTool(coords);
                    break;
            }
        };
        public hoverIn(e: any, self: any): void { };
        public hoverOut(e: any, self: any): void { };
        public mouseDown(e: any, self: any): void {
            self.setOffset(e.offsetX, e.offsetY);
        };
        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            //console.log('field drag', dx, dy, posx, posy);
        };
        public dragStart(x: number, y: number, e: any): void {
        };
        public dragEnd(e: any): void {
        };
        public getOffset(): Playbook.Models.Coordinates {
            return this.offset;
        };
        public getOffsetX(): number {
            return this.offset && this.offset.x;
        };
        public getOffsetY(): number {
            return this.offset && this.offset.y;
        };
        public setOffset(offsetX: number, offsetY: number) {
            this.setOffsetX(offsetX);
            this.setOffsetY(offsetY);
        };
        public setOffsetX(value: number) {
            this.offset.x = value;
        };
        public setOffsetY(value: number) {
            this.offset.y = value;
        };
    }
}
