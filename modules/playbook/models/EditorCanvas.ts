/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorCanvas
    extends Common.Models.Canvas
    implements Common.Interfaces.ICanvas {

        constructor(
            scenario: Common.Models.Scenario, 
            width?: number, 
            height?: number
        ) {
            super(scenario);

            /**
             * Note that paper is created during the initialize() method;
             * canvas is dependent on angular directive / dynamic HTML include
             * of the canvas, before the $container/container properties are
             * available; these containers are required by the paper, which
             * implements a Raphael object, that requires a container HTML element.
             */
            //this.unitType = this.playPrimary.unitType;
            //this.editorType = this.playPrimary.editorType;
            this.toolMode = Playbook.Enums.ToolModes.Select;

            // need to set tab explicitly if it's within an editor
            this.tab = null;

            this.listener = new Common.Models.CanvasListener(this);
            this.readyCallbacks = [function() {
                console.log('CANVAS READY: default canvas ready callback');
            }];
        }

        public initialize($container) {
            var self = this;
            this.container = $container[0]; // jquery lite converted to raw html
            this.$container = $container; // jquery lite object
            this.setDimensions();
            this.paper = new Playbook.Models.EditorPaper(this);
            this.paper.draw();

            // TODO @theBull - stop / pause this timer if the canvas is not
            // visible...
            // this.widthChangeInterval = setInterval(function() {
            // 	if(self.width != self.$container.width()) {
            // 		// width has changed; update the canvas dimensions and
            // 		// resize.
            // 		self.width = self.$container.width();
            // 		self.height = self.$container.height();
            // 		self.resize();
            // 	}
            // }, 1);

            this._ready();
        }

        public setDimensions(): void {
            this.dimensions.width = this.$container.width();
            this.dimensions.height = this.$container.height();
        }

        public resetHeight() {
            //this.height = this.$container.height(this.$container.height());
        }

        public zoomIn() {
            throw new Error('canvas zoomIn() not implemented');
        }

        public zoomOut() {
            throw new Error('canvas zoomOut() not implemented');
        }

        public getToolMode() {
            return this.toolMode;
        }

        public getToolModeName() {
            return Playbook.Enums.ToolModes[this.toolMode];
        }
    }
}
