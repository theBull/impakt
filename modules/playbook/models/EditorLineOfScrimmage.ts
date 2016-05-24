/// <reference path='./models.ts' />


module Playbook.Models {

    export class EditorLineOfScrimmage
    extends Common.Models.LineOfScrimmage {

        constructor() {
            super();
        }

        public initialize(field: Common.Interfaces.IField): void {
            super.initialize(field);
            this.graphics.dimensions.offset.x = 0;
            this.graphics.dimensions.offset.y = 8;
            this.graphics.dimensions.setHeight(4);
            this.graphics.selectedFill = 'blue';
        }

        public draw(): void {
            this.graphics.rect();
            this.graphics.setAttribute('class', 'ns-resize');

            // this.graphics.onmousedown(
            //     this.mousedown,
            //     this
            // );

            // this.graphics.onmouseup(
            //     this.mouseup,
            //     this
            // );

            // this.graphics.onclick(
            //     this.click,
            //     this
            // );
            
            this.graphics.ondrag(
                this.dragMove,
                this.dragStart,
                this.dragEnd,
                this
            );
        }
        // public mousedown(e: any, context: Common.Interfaces.IFieldElement): void {
        //     if (e.keyCode == Common.Input.Which.RightClick) {
        //         context.contextmenu(e, context);
        //     }
        //     this.graphics.select();
        // }
        // public mouseup(e: any, context: Common.Interfaces.IFieldElement): void {
        //     this.graphics.deselect();
        // }
        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            let snapDx = this.grid.snapping ? this.grid.snapPixel(dx) : dx;
            let snapDy = this.grid.snapping ? this.grid.snapPixel(dy) : dy;
            this.graphics.moveByDelta(
                this.graphics.placement.coordinates.x, 
                snapDy
            );
            
            this.field.ball.dragging = true;
            this.field.ball.layer.moveByDelta(
                this.field.ball.graphics.placement.coordinates.x,
                snapDy
            );

            this.field.primaryPlayers.forEach(
                function(player: Common.Interfaces.IPlayer, index: number) {
                    player.layer.layers.forEach(function(layer: Common.Models.Layer) {
                        layer.moveByDelta(
                            player.graphics.placement.coordinates.x,
                            snapDy
                        );
                    });
                });
        }
        public dragStart(e: any): void {
            this.dragging = true;
        }
        public dragEnd(e: any): void {
            this.drop();
            this.field.ball.drop();
            this.field.primaryPlayers.forEach(
                function(player: Common.Interfaces.IPlayer, index: number) {
                    player.drop();
                });
        }
    }
}
