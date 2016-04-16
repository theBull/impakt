/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class PreviewCanvas
    extends Common.Models.Canvas
    implements Common.Interfaces.ICanvas {

        constructor(
            playPrimary: Common.Models.PlayPrimary,
            playOpponent: Common.Models.PlayOpponent
        ) {
            super();
            this.playPrimary = playPrimary;
            this.playOpponent = playOpponent;
            this.dimensions.setMinWidth(250);
            this.dimensions.setMinHeight(200);
            this.$exportCanvas = $('<canvas/>', {
                id: 'exportCanvas' + this.guid
            }).width(500).height(400);
            this.exportCanvas = this.$exportCanvas[0];
        }

        public initialize($container: any) {
            this.container = $container[0]; // jquery lite converted to raw html
            this.$container = $container;
            this.dimensions.width = 500; //this.$container.width();
            this.dimensions.height = 400; //this.$container.height();
            this.paper = new Playbook.Models.PreviewPaper(this);
            this.paper.initialize();
            this.paper.draw();
        }
    }
}