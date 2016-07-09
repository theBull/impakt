/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class PreviewCanvas
    extends Common.Models.Canvas
    implements Common.Interfaces.ICanvas {

        constructor() {
            super();
            this.sizingMode = Common.Enums.CanvasSizingModes.PreviewWidth;
            this.dimensions.setMinWidth(250);
            this.dimensions.setMinHeight(200);
            this.state = Common.Enums.State.Constructed;
        }

        public initialize($container: any) {
            this.container = $container[0]; // jquery lite converted to raw html
            this.$container = $container;
            this.setDimensions();

            // NOTE: Grid size uses PREVIEW constants
            this.grid = new Common.Models.Grid(
                this,
                Playbook.Constants.FIELD_COLS_FULL,
                Playbook.Constants.FIELD_ROWS_FULL
            );

            this.drawing = new Common.Drawing.Utilities(this, this.grid);
            this.field = new Playbook.Models.PreviewField(this);
            this.field.initialize();

            this.$exportCanvas = $('<canvas/>', {
                id: 'exportCanvas' + this.guid
            }).width(this.dimensions.width).height(this.dimensions.height);
            this.exportCanvas = this.$exportCanvas[0];

            this.invokeListener('onready');
            this.state = Common.Enums.State.Ready;
        }

        public setDimensions() {
            this.dimensions.width = Math.min(500, this.$container.width());
            this.dimensions.height = Math.min(400, this.$container.height());
        }
    }
}