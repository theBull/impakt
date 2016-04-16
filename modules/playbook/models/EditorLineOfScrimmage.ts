/// <reference path='./models.ts' />


module Playbook.Models {

    export class EditorLineOfScrimmage
    extends Common.Models.LineOfScrimmage {

        constructor(field: Common.Interfaces.IField) {
            super(field);

            this.layer.graphics.dimensions.offset.x = 0;
            this.layer.graphics.dimensions.offset.y = 8;
            this.layer.graphics.dimensions.setHeight(4);
            this.layer.graphics.selectedFill = 'blue';
        }
        public draw(): void {
            this.layer.graphics.rect();
            this.layer.graphics.setAttribute('class', 'ns-resize');

            // this.layer.graphics.onmousedown(
            //     this.mousedown,
            //     this
            // );

            // this.layer.graphics.onmouseup(
            //     this.mouseup,
            //     this
            // );

            // this.layer.graphics.onclick(
            //     this.click,
            //     this
            // );
            
            this.layer.graphics.ondrag(
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
        //     this.layer.graphics.select();
        // }
        // public mouseup(e: any, context: Common.Interfaces.IFieldElement): void {
        //     this.layer.graphics.deselect();
        // }
        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            let snapDx = this.grid.snapping ? this.grid.snapPixel(dx) : dx;
            let snapDy = this.grid.snapping ? this.grid.snapPixel(dy) : dy;
            this.layer.graphics.moveByDelta(
                this.layer.graphics.placement.coordinates.x, 
                snapDy
            );
            
            this.field.ball.layer.graphics.dragging = true;
            this.field.ball.layer.graphics.moveByDelta(
                this.field.ball.layer.graphics.placement.coordinates.x,
                snapDy
            );

            this.field.players.forEach(
                function(player: Common.Interfaces.IPlayer, index: number) {
                    player.layer.layers.forEach(function(layer: Common.Models.Layer) {
                        layer.graphics.moveByDelta(
                            player.layer.graphics.placement.coordinates.x,
                            snapDy
                        );
                    });
                });
        }
        public dragStart(e: any): void {
            this.layer.graphics.dragging = true;
        }
        public dragEnd(e: any): void {
            this.drop();
            this.field.ball.drop();
            this.field.players.forEach(
                function(player: Common.Interfaces.IPlayer, index: number) {
                    player.drop();
                });
        }
    }
}
