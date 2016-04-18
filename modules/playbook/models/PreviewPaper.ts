/// <reference path='./models.ts' />

module Playbook.Models {
    export class PreviewPaper
    extends Common.Models.Paper
    implements Common.Interfaces.IPaper {

        constructor(previewCanvas: Common.Interfaces.ICanvas) {
            super(previewCanvas);
            this.canvas = previewCanvas;
            this.sizingMode = Common.Enums.PaperSizingModes.PreviewWidth;
            this.showBorder = false;
        }

        public initialize(): void {
            // NOTE: Grid size uses PREVIEW constants
            this.grid = new Common.Models.Grid(
                this, 
                Playbook.Constants.FIELD_COLS_FULL, 
                Playbook.Constants.FIELD_ROWS_FULL
            );

            this.drawing = new Common.Drawing.Utilities(this.canvas, this.grid);

            // Paper methods within field are dependent on 
            // this.Raphael
            this.field = new Playbook.Models.PreviewField(
                this, 
                this.canvas.playPrimary, 
                this.canvas.playOpponent
            );

            this.scroll(0, -(this.canvas.dimensions.height / 2));
        }

        public updatePlay(playPrimary, playOpponent) {
            throw new Error('PreviewPaper updatePlay(): not implemented');
        }
    }
}
