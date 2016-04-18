/// <reference path='./models.ts' />

module Playbook.Models {

    export class PreviewGround
    extends Common.Models.Ground {

        constructor(field: Common.Interfaces.IField) {
            super(field);
        }
        public draw(): void {
            super.draw();
        }
        public hoverIn(e: any, self: any): void { 
            // hover not implemented in preview
        }
        public hoverOut(e: any, self: any): void { 
            // hover not implemented in preview
        }
        public click(e: any, self: any): void {
            // click not implemented in preview
        }
        public mouseDown(e: any, self: any): void {
            // mousedown not implemented in preview
        }
        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            // drag not implemented in preview
        }
        public dragStart(x: number, y: number, e: any): void {
            // drag not implemented in preview
        }
        public dragEnd(e: any): void {
            // drag not implemented in preview
        }
    }
}