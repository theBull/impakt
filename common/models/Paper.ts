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
            this.showBorder = false;
        }

        public abstract initialize(): void;

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

        public draw() {
            this.field.initialize();
            if (this.showBorder)
                this.drawOutline();
        }

        public updateScenario(scenario: Common.Models.Scenario) {
            this.field.updateScenario(scenario);
        }

        public resize() {
            this.grid.resize(this.sizingMode);
            this.setViewBox();
            this.draw();
        }

        public clear(): void {
            this.field.clearScenario();
        }

        public setViewBox(center?: boolean) {
            center = center === true;
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
                        this.canvas.dimensions.width,
                        this.canvas.dimensions.height,
                        true
                    );
                }
                this.viewOutline.attr({
                    x: self.x + 1,
                    y: self.y + 1,
                    width: self.canvas.dimensions.width - 1,
                    height: self.canvas.dimensions.height - 1,
                    stroke: 'red'
                });
            }
        }
        
        /**
         * Scrolls to the given x/y pixels (top/left). If center is set to true,
         * centers the scroll on the x/y pixels.
         * 
         * @param {number}  scrollToX [description]
         * @param {number}  scrollToY [description]
         * @param {boolean} center    [description]
         */
        public scroll(scrollToX: number, scrollToY: number, center?: boolean) {
            center = center === true;
            this.y = center ? this.field.getLOSAbsolute() : scrollToY;
            return this.setViewBox(center);
        }
    }
}