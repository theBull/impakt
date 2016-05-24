/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class PreviewCanvas
    extends Common.Models.Canvas
    implements Common.Interfaces.ICanvas {

        constructor(
            scenario: Common.Models.Scenario
        ) {
            super(scenario);

            this.dimensions.setMinWidth(250);
            this.dimensions.setMinHeight(200);
        }

        public initialize($container: any) {
            this.container = $container[0]; // jquery lite converted to raw html
            this.$container = $container;
            this.setDimensions();
            this.paper = new Playbook.Models.PreviewPaper(this);
            this.paper.draw();
            this.$exportCanvas = $('<canvas/>', {
                id: 'exportCanvas' + this.guid
            }).width(this.dimensions.width).height(this.dimensions.height);
            this.exportCanvas = this.$exportCanvas[0];

            this._ready();
        }

        public setDimensions() {
            this.dimensions.width = Math.min(500, this.$container.width());
            this.dimensions.height = Math.min(400, this.$container.height());
        }
    }
}