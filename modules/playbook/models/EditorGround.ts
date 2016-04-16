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

        public mousemove(e: any, context: Common.Interfaces.IFieldElement) {
            // get current coordinates
            context.field.setCursorCoordinates(e.offsetX, e.offsetY);
            //console.log(context.field.cursorCoordinates);
        }

        public click(e: any, context: Common.Interfaces.IGround): void {
            let coords = context.getClickCoordinates(e.offsetX, e.offsetY);
            console.log('ground clicked', coords);
            let toolMode = context.paper.canvas.toolMode;
            switch (toolMode) {
                case Playbook.Enums.ToolModes.Select:
                    console.log('selection mode');
                    context.field.deselectAll();
                    break;
                case Playbook.Enums.ToolModes.None:
                    console.log('no mode');
                    context.field.deselectAll();
                    break;
                case Playbook.Enums.ToolModes.Assignment:
                    context.field.useAssignmentTool(coords);
                    break;
            }
        }
    }
}
