/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorCanvas
    extends Common.Models.Canvas
    implements Common.Interfaces.ICanvas {

        constructor(
            playPrimary: Common.Models.PlayPrimary, 
            playOpponent: Common.Models.PlayOpponent, 
            width?: number, 
            height?: number
        ) {
            super();
            /**
             * TODO @theBull - find a better way to pass data into the canvas...
             * it shouldn't be dependent on play data at this level..........? maybe?
             */
            this.playPrimary = playPrimary;
            this.playOpponent = playOpponent;
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
            this.dimensions.width = this.$container.width();
            this.dimensions.height = this.$container.height();
            this.paper = new Playbook.Models.EditorPaper(this);
            this.paper.initialize();
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

        public updatePlay(
            playPrimary: Common.Models.PlayPrimary, 
            playOpponent: Common.Models.PlayOpponent, 
            redraw?: boolean): void 
        {
            this.playPrimary = playPrimary || this.playPrimary;
            this.playOpponent = playOpponent || this.playOpponent;
            this.unitType = this.playPrimary.unitType;
            this.editorType = this.playPrimary.editorType;
            this.paper.updatePlay(this.playPrimary, this.playOpponent);
            
            this.setModified(true);
        }

        public resize() {
            var self = this;
            this.dimensions.width = this.$container.width();
            this.dimensions.height = this.$container.height();
            this.paper.resize();
            if (this.scrollable) {
                this.scrollable.initialize(this.$container, this.paper);
                this.scrollable.onready(function (content) {
                    self.scrollable.scrollToPercentY(0.5);
                });
            }
        }

        public setScrollable(scrollable: any) {
            this.scrollable = scrollable;
        }

        public resetHeight() {
            //this.height = this.$container.height(this.$container.height());
        }

        public setListener(actionId, fn) {
            this.listener.listen(actionId, fn);
        }

        public invoke(actionId, data, context) {
            console.log('invoking action: ', actionId);
            this.listener.invoke(actionId, data, context);
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