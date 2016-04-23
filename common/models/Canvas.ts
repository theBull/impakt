/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Canvas
    extends Common.Models.Modifiable
    implements Common.Interfaces.ICanvas {
        
        public paper: Common.Interfaces.IPaper;
        public playPrimary: Common.Models.PlayPrimary;
        public playOpponent: Common.Models.PlayOpponent;
        public $container: any;
        public container: HTMLElement;
        public $exportCanvas: any;
        public exportCanvas: HTMLCanvasElement;
        public scrollable: any;
        public toolMode: Playbook.Enums.ToolModes;
        public unitType: Team.Enums.UnitTypes;
        public editorType: Playbook.Enums.EditorTypes;
        public tab: Common.Models.Tab;
        public dimensions: Common.Models.Dimensions;
        public listener: Common.Models.CanvasListener;
        public readyCallbacks: Function[];
        public widthChangeInterval: any;

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

        public remove() {
            this.playOpponent = null;
            this.playPrimary = null;
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
            if (Common.Utilities.isNullOrUndefined(this.paper))
                throw new Error('Canvas refresh(): paper is null or undefined');
            
            this.paper.draw();
        }

        public abstract setDimensions(): void;
        
        public onready(callback) {
            if (this.readyCallbacks && this.readyCallbacks.length > 1000)
                throw new Error('Canvas onready(): callback not added; max ready callback limit exceeded');
            this.readyCallbacks.push(callback);
        }
        public _ready() {
            if (Common.Utilities.isNullOrUndefined(this.readyCallbacks))
                return;

            for (var i = 0; i < this.readyCallbacks.length; i++) {
                this.readyCallbacks.pop()();
            }
        }
        
        public clearListeners(): void {
            this.readyCallbacks = [];
        }

        public resize() {
            var self = this;
            this.dimensions.width = this.$container.width();
            this.dimensions.height = this.$container.height();
            this.paper.resize();
            if (this.scrollable) {
                this.scrollable.initialize(this.$container, this.paper);
                this.scrollable.onready(function(content) {
                    self.scrollable.scrollToPercentY(0.5);
                });
            }
        }

        public setScrollable(scrollable: any) {
            this.scrollable = scrollable;
        }
    }
}
