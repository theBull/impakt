/// <reference path='./models.ts' />

module Playbook.Models {
    export class EditorPaper 
    extends Common.Models.Paper 
    implements Common.Interfaces.IPaper {

        public drawing: Common.Drawing.Utilities;        

        constructor(canvas: Common.Interfaces.ICanvas) {
            super(canvas);
        }

        public initialize(): void {
            // Grid will help the paper determine its sizing
            // and will be the basis for drawing objects' lengths and
            // dimensions.
            this.grid = this.grid || new Common.Models.Grid(
                this,
                Playbook.Constants.FIELD_COLS_FULL,
                Playbook.Constants.FIELD_ROWS_FULL
            );

            this.drawing = new Common.Drawing.Utilities(this.canvas, this.grid);

            // Paper methods within field are dependent on 
            // this.Raphael
            this.field = this.field ||
                new Playbook.Models.EditorField(
                    this,
                    this.canvas.playPrimary,
                    this.canvas.playOpponent
                );
        }
        public draw() {
            this.clear();
            if (this.showBorder)
                this.drawOutline();

            this.field.initialize();
        }
        public updatePlay(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent) {
            this.field.updatePlay(playPrimary, playOpponent);
        }
    }
}