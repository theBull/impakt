/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Paper {

        public canvas: Common.Interfaces.ICanvas;
        public grid: Common.Interfaces.IGrid;
        public field: Common.Interfaces.IField;
        public drawing: Common.Drawing.Utilities;
        public sizingMode: Common.Enums.PaperSizingModes;
        public x: number;
        public y: number;
        public scrollSpeed: number;
        public zoomSpeed: number;
        public showBorder: boolean;
        public viewOutline: any;

        constructor(canvas: Common.Interfaces.ICanvas) {
            this.canvas = this.canvas || canvas;
            // By default, paper should be scaled based on max canvas width
            this.sizingMode = this.sizingMode || Common.Enums.PaperSizingModes.MaxCanvasWidth;
            this.x = 0;
            this.y = 0;
            this.scrollSpeed = 0.5;
            this.zoomSpeed = 100;
            this.showBorder = this.showBorder === true;
        }

        public getWidth() {
            return this.grid.dimensions.width;
        }
        public getHeight() {
            return this.grid.dimensions.height;
        }
        public getXOffset() {
            return -Math.round((
                this.canvas.dimensions.width 
                - this.grid.dimensions.width) / 2
            );
        }

        public draw(): void {

        }

        public resize() {
            this.grid.resize(this.sizingMode);
            this.setViewBox();
            this.draw();
        }

        public clear() {
            return this.drawing.clear();
        }

        public setViewBox() {
            this.drawing.setAttribute('width', this.grid.dimensions.width);

            //this.x = this.getXOffset();
            let setting = this.drawing.setViewBox(
                this.x,
                this.y, 
                this.grid.dimensions.width, 
                this.grid.dimensions.height, 
                true
            );
        }

        public drawOutline() {
            let self = this;
            if (this.showBorder) {
                // paper view port
                if (!this.viewOutline) {
                    this.viewOutline = this.drawing.rect(
                        this.x,
                        this.y,
                        this.canvas.dimensions.width - 10,
                        this.canvas.dimensions.height - 10,
                        true,
                        5, 
                        5
                    );
                }
                this.viewOutline.attr({
                    x: self.x + 5,
                    y: self.y + 5,
                    width: self.canvas.dimensions.width - 10,
                    height: self.canvas.dimensions.height - 10,
                    stroke: 'red'
                });
            }
        }
        
        public scroll(scrollToX: number, scrollToY: number) {
            this.y = scrollToY;
            return this.setViewBox();
        }     
    }
}