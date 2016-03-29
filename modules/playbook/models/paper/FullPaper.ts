/// <reference path='../models.ts' />

module Playbook.Models {
    export class FullPaper
        extends Playbook.Models.Paper {

        constructor(canvas: Playbook.Interfaces.ICanvas) {
            super(canvas);
            
            // Grid will help the paper determine its sizing
            // and will be the basis for drawing objects' lengths and
            // dimensions.
            this.grid = new Playbook.Models.Grid(this, Playbook.Constants.FIELD_COLS_FULL, Playbook.Constants.FIELD_ROWS_FULL);
            
            // this is the actual Raphael paper
            this.Raphael = Raphael(this.canvas.container, this.grid.width, this.grid.height // * 2
            );
            
            // Paper methods within field are dependent on 
            // this.Raphael
            this.field = new Playbook.Models.Field(this, this.canvas.playPrimary, this.canvas.playOpponent);
        }
    }
}