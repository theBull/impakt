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
            
            this.initialize();
        }

        public initialize(): void {
            // NOTE: Grid size uses PREVIEW constants
            this.grid = new Common.Models.Grid(
                this, 
                Playbook.Constants.FIELD_COLS_FULL, 
                Playbook.Constants.FIELD_ROWS_FULL
            );

            this.drawing = new Common.Drawing.Utilities(this.canvas, this.grid);
            this.field = new Playbook.Models.PreviewField(this, this.canvas.scenario);
        }
    }
}
