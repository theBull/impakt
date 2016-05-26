/// <reference path='./models.ts' />


module Playbook.Models {

    export class EditorLineOfScrimmage
    extends Common.Models.LineOfScrimmage {

        constructor() {
            super();
        }

        public initialize(field: Common.Interfaces.IField): void {
            super.initialize(field);
            this.graphics.dimensions.setOffsetXY(0, 8);
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

            this.onhover(
                this.hoverIn,
                this.hoverOut,
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
        
        public hoverIn(e: any): void {
            this.graphics.setHeight(7);
        }

        public hoverOut(e: any): void {
            this.graphics.setHeight(4);
        }

        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            // Ignore drag motions under specified threshold to prevent
            // click/mousedown from triggering drag method
            if (!this.dragging && !this.isOverDragThreshold(dx, dy)) {
                return;
            } else {
                this.dragging = true;
            }

            this.layer.moveByDelta(0, dy);
            
            this.field.ball.dragging = true;
            this.field.ball.layer.moveByDelta(0, dy);

            this.field.primaryPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                player.layer.moveByDelta(0, dy);
                player.moveAssignmentByDelta(0, dy);
            });

            this.field.opponentPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                player.layer.moveByDelta(0, dy);
                player.moveAssignmentByDelta(0, dy);
            });

            this.setModified(true);
        }
        
        public dragStart(x: number, y: number, e: any): void {
            super.dragStart(x, y, e);
        }

        public dragEnd(e: any): void {
            if(this.dragging) {
                this.drop();
                
                this.field.ball.drop();

                this.field.primaryPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                    player.drop();
                    player.dropAssignment();
                });

                this.field.opponentPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                    player.drop();
                    player.dropAssignment();
                });

                this.dragging = false;
            }
        }
    }
}
