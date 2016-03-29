/// <reference path='../models.ts' />

module Playbook.Models {
    export class PreviewPaper
    extends Playbook.Models.Paper {
        
        constructor(previewCanvas: Playbook.Interfaces.ICanvas) {
            super(previewCanvas);
            this.canvas = previewCanvas;
            this.sizingMode = Playbook.Editor.PaperSizingModes.PreviewWidth;
            this.showBorder = false;
            // NOTE: Grid size uses PREVIEW constants
            this.grid = new Playbook.Models.Grid(this, Playbook.Constants.FIELD_COLS_PREVIEW, Playbook.Constants.FIELD_ROWS_PREVIEW);
            this.Raphael = Raphael(this.canvas.container, this.grid.width, this.grid.height // * 2
            );
            // Paper methods within field are dependent on 
            // this.Raphael
            this.field = new Playbook.Models.PreviewField(this, this.canvas.playPrimary, this.canvas.playOpponent);
        }
    }
}
