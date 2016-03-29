/// <reference path='../models.ts' />

module Playbook.Models {
    export class PreviewCanvas
    extends Playbook.Models.Canvas {

        constructor(
            playPrimary: Playbook.Models.PlayPrimary,
            playOpponent: Playbook.Models.PlayOpponent
        ) {
            super(playPrimary, playOpponent);
            this.minWidth = 250;
            this.minHeight = 200;
            this.toolMode = Playbook.Editor.ToolModes.None;
            this.$exportCanvas = $('<canvas/>', {
                id: 'exportCanvas' + this.guid
            }).width(500).height(400);
            this.exportCanvas = this.$exportCanvas[0];
        }
        public initialize($container: any) {
            this.container = $container[0]; // jquery lite converted to raw html
            this.$container = $container;
            this.width = 500; //this.$container.width();
            this.height = 400; //this.$container.height();
            this.paper = new Playbook.Models.PreviewPaper(this);
            this.paper.draw();
        };
        public refresh() {
            this.paper.draw();
        };
    }
}