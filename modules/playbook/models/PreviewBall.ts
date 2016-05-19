/// <reference path='./models.ts' />

module Playbook.Models {

    export class PreviewBall 
    extends Common.Models.Ball
    implements Common.Interfaces.IBall {

        constructor() {
            super();
        }

        public initialize(field: Common.Interfaces.IField) {
            super.initialize(field);
        }

        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            // Not implemented - preview ball does not have drag functionality
        }
        public dragStart(x: number, y: number, e: any): void {
            // Not implemented - preview ball does not have drag functionality
        }
        public dragEnd(e: any): void {
            // Not implemented - preview ball does not have drag functionality
        }
    }
}
