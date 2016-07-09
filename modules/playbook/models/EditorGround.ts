/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorGround
    extends Common.Models.Ground {

        public selectionBox: Common.Models.FieldSelectionBox;

        constructor() {
            super();
            this.selectionBox = new Common.Models.FieldSelectionBox();
        }

        public initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void {
            super.initialize(field, null);
            this.selectionBox.initialize(field, null);
            this.layer.addLayer(this.selectionBox.layer);
        }
        
        public draw(): void {
            this.graphics.rect();

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
            this.graphics.onmousemove(
                this.mousemove,
                this
            );
        }

        public mousemove(e: any) {
            // get current coordinates
            this.field.setCursorCoordinates(e.offsetX, e.offsetY);
            //console.log(context.field.cursorCoordinates);
        }

        public click(e: any): void {
            let coords = this.getClickCoordinates(e.offsetX, e.offsetY);
            console.log('ground clicked', coords);
            let toolMode = this.canvas.toolMode;
            
            switch (toolMode) {
                case Playbook.Enums.ToolModes.Select:
                    console.log('selection mode');
                    this.field.deselectAll();
                    break;

                case Playbook.Enums.ToolModes.None:
                    console.log('no mode');
                    this.field.deselectAll();
                    break;

                case Playbook.Enums.ToolModes.Assignment:
                    this.field.useAssignmentTool(coords);
                    break;
            }
        }

        public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
            if (!this.isOverDragThreshold(dx, dy))
                return;
            else
                this.dragging = true;

            let direction = '';
            let offsetX = 0;
            let offsetY = 0;
            if(dx < 0) {
                offsetX = dx;
                dx = -1 * dx;
            }
            if(dy < 0) {
                offsetY = dy;
                dy = -1 * dy;
            }

            this.selectionBox.graphics.dimensions.setWidth(dx);
            this.selectionBox.graphics.dimensions.setHeight(dy);
            this.selectionBox.draw();
            this.selectionBox.graphics.transform(offsetX, offsetY);
        }
        public dragStart(x: number, y: number, e: any): void {
            super.dragStart(x, y, e);

            let coords = this.getClickAbsolute(e.offsetX, e.offsetY);

            // if(this.selectionBox.graphics.hasRaphael()) {
            //     this.selectionBox.layer.show();
            // } else {
            //     this.selectionBox.draw();
            // }

            this.selectionBox.graphics.location.ax = coords.x;
            this.selectionBox.graphics.location.ay = coords.y;
        }
        public dragEnd(e: any): void {
            if (this.dragging) {

                this.selectionBox.graphics.dimensions.setHeight(0);
                this.selectionBox.graphics.dimensions.setWidth(0);
                //this.selectionBox.layer.hide();

                let bounds = this.selectionBox.graphics.getBBox();
                this.selectionBox.graphics.remove();

                console.log(bounds);
                this.field.primaryPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                    // Here, we want to get the x,y vales of each object
                    // regardless of what sort of shape it is.
                    // But rect uses rx and ry, circle uses cx and cy, etc
                    // So we'll see if the bounding boxes intercept instead

                    let playerBounds = player.icon.graphics.getBBox();

                    //do bounding boxes overlap?
                    //is one of this object's x extremes between the selection's xe xtremes?
                    if (playerBounds.x >= bounds.x && playerBounds.x <= bounds.x + bounds.width ||
                        playerBounds.x + playerBounds.width >= bounds.x &&
                        playerBounds.x + playerBounds.width <= bounds.x + bounds.width) {
                        //same for y
                        if (playerBounds.y >= bounds.y && playerBounds.y <= bounds.y + bounds.height ||
                            playerBounds.y + playerBounds.height >= bounds.y &&
                            playerBounds.y + playerBounds.height <= bounds.y + bounds.height
                        ) {
                            player.toggleSelect(true);
                        }
                    }
                });
            }

            super.dragEnd(e);
        }
    }
}
