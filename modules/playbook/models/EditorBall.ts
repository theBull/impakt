/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorBall 
    extends Common.Models.Ball
    implements Common.Interfaces.IBall {

        constructor() {
            super();
        }

        public initialize(field: Common.Interfaces.IField) {
            super.initialize(field);
        }

        public draw(): void {
            super.draw();

            // Attach event handlers
            this.graphics.onclick(
                this.click, 
                this
            );
            this.graphics.ondrag(
                this.dragMove, 
                this.dragStart, 
                this.dragEnd,
                this
            );
        }

        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            // NOTE: moveByDelta methods are called separately in the x and y
            // directions to ensure that even if the ball is moved to the
            // peripherals of its containment in either x or y direction,
            // it is still able to move in the other direction, provided
            // that it is still within its containment area
            this.graphics.moveByDeltaX(dx);
            this.graphics.moveByDeltaY(dy);

            // update line of scrimmage - do not track difference in x movement,
            // only track y movement up and down the field
            this.field.ball.graphics.moveByDeltaY(dy);
           
        }

        public dragStart(x: number, y: number, e: any): void {
            // drag not implemented in preview
        }

        public dragEnd(e: any): void {
            this.graphics.drop();
            this.field.ball.graphics.drop();
        }
    }
}
