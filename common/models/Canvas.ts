/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Canvas
    extends Common.Models.Modifiable
    implements Common.Interfaces.ICanvas {
        
        public field: Common.Interfaces.IField;
        public grid: Common.Interfaces.IGrid;
        public drawing: Common.Drawing.Utilities;
        public sizingMode: Common.Enums.CanvasSizingModes;
        public $container: any;
        public container: HTMLElement;
        public $exportCanvas: any;
        public exportCanvas: HTMLCanvasElement;
        public tab: Common.Models.Tab;
        public dimensions: Common.Models.Dimensions;
        public x: number;
        public y: number;
        public listener: Common.Models.CanvasListener;
        public readyCallbacks: Function[];
        public widthChangeInterval: any;
        public active: boolean;
        public editorType: Playbook.Enums.EditorTypes;
        public toolMode: Playbook.Enums.ToolModes;
        public state: Common.Enums.State;

        constructor(
            width?: number, 
            height?: number
        ) {
            super();   
            super.setContext(this);            
                     
            /**
             * Note that paper is created during the initialize() method;
             * canvas is dependent on angular directive / dynamic HTML include
             * of the canvas, before the $container/container properties are
             * available; these containers are required by the paper, which
             * implements a Raphael object, that requires a container HTML element.
             */
            this.sizingMode = this.sizingMode || Common.Enums.CanvasSizingModes.MaxContainerWidth;
            this.x = 0;
            this.y = 0;
            this.dimensions = new Common.Models.Dimensions();
            this.dimensions.setMinWidth(500);
            this.dimensions.setMinHeight(400);
            // TODO @theBull - look for performance improvements here
            // 
            // Maintains a window interval timer which checks every 1ms for
            // a change in container width; will fire a resize() if necessary
            this.widthChangeInterval = null;
            this.readyCallbacks = [];
            this.listener = new Common.Models.CanvasListener(this);
        }

        public abstract initialize($container: any): void;
        public abstract setDimensions(): void;

        public clear(): void {
            this.clearListeners();
            this.field.clearScenario();
            this.setModified(true);
        }

        /**
         * Converts this canvas's SVG graphics element into a data-URI
         * which can be used in an <img/> src attribute to render the image
         * as a PNG. Allows for retrieval and storage of the image as well.
         *
         * 3/9/2016: https://css-tricks.com/data-uris/
         * @return {string} [description]
         */
        public exportToPng() {
            if (!this.$container) {
                throw new Error('Canvas exportToPng(): Cannot export to png; \
                SVG parent $container is null or undefined');
            }
            var svgElement = this.$container.find('svg')[0];
            if (!svgElement) {
                throw new Error('Canvas exportToPng(): Cannot export to png; \
                Could not find SVG element inside of canvas $container');
            }
            return Common.Utilities.exportToPng(this, svgElement);
        }
        public getSvg() {
            var $svg = $('svg');
            var serializer = new XMLSerializer();
            var svg_blob = serializer.serializeToString($svg[0]);
            return svg_blob;
        }

        public refresh() {            
            this.field.draw();
        }

        public resize() {
            this.dimensions.width = this.$container.width();
            this.dimensions.height = this.$container.height();
            this.grid.resize(this.sizingMode);
            this.setViewBox();
        }

        public getWidth() {
            return this.grid.dimensions.width;
        }
        public getHeight() {
            return this.grid.dimensions.height;
        }

        public getXOffset() {
            return -Math.round((
                this.dimensions.width
                - this.grid.dimensions.width) / 2
            );
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
    }
}
