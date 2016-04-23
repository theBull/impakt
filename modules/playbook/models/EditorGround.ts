/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorGround
    extends Common.Models.Ground {

        constructor(field: Common.Interfaces.IField) {
            super(field);
        }
        public draw(): void {
            this.layer.graphics.rect();

            this.layer.graphics.onclick(
                this.click, 
                this
            );
            this.layer.graphics.ondrag(
                this.dragMove, 
                this.dragStart, 
                this.dragEnd,
                this
            );
            this.layer.graphics.onmousemove(
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
            let toolMode = this.paper.canvas.toolMode;
            
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
    }
}
