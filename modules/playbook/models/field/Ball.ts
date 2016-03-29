/// <reference path='../models.ts' />

module Playbook.Models {

    export class Ball extends Playbook.Models.FieldElement {

        public offset: number;

        constructor(context: Playbook.Interfaces.IField) {
            super(context);
            this.color = 'brown';

            this.placement = new Playbook.Models.Placement(0, 0, null);
            this.placement.coordinates = new Playbook.Models.Coordinates(
                Playbook.Constants.BALL_DEFAULT_PLACEMENT_X,
                Playbook.Constants.BALL_DEFAULT_PLACEMENT_Y
            );
            this.width = this.grid.getSize() * 0.15;
            this.height = this.grid.getSize() * 0.25;
            this.offset = this.grid.getCenter().x;
        }
        public draw(): void {
            console.log('drawing football...');
            this.raphael = this.paper.ellipse(
                this.placement.coordinates.x,
                this.placement.coordinates.y,
                this.width,
                this.height
            ).attr({
                'fill': this.color
            });
            super.click(this.click, this);
            super.mousedown.call(this.mousedown, this);
            this.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this);
            // constrain x/y directions
            // move LOS and all players with ball
        }
        public click(e: any, self: any): void {
            console.log(['Ball at (', self.coordinates.x, self.coordinates.y, ')'].join(''));
            throw new Error('Ball click(): not implemented');
        }
        public mousedown(e: any, self: any): void {
            throw new Error('Ball mousedown(): not implemented');
        }
        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            throw new Error('Ball dragMove(): not implemented');
        }
        public dragStart(x: number, y: number, e: any): void {
            throw new Error('Ball dragStart(): not implemented');
        }
        public dragEnd(e: any): void {
            throw new Error('Ball dragEnd(): not implemented');
        }
        public isWhichSideOf(coords: Playbook.Models.Coordinates)
        : Playbook.Models.Coordinates 
        {
            return new Playbook.Models.Coordinates(
                this.isLeftOf(coords.x) ? -1 : 1, 
                this.isAbove(coords.y) ? 1 : -1
            );
        }
        public isLeftOf(x) {
            return this.placement.coordinates.x > x;
        }
        public isRightOf(x) {
            return this.placement.coordinates.x <= x;
        }
        public isAbove(y) {
            return this.placement.coordinates.y > y;
        }
        public isBelow(y) {
            return this.placement.coordinates.y <= y;
        }
    }
}
