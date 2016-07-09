/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorCanvas
    extends Common.Models.Canvas
    implements Common.Interfaces.ICanvas {

        constructor(
            width?: number, 
            height?: number
        ) {
            super(width, height);

            this.toolMode = Playbook.Enums.ToolModes.Select;
            this.editorType = Playbook.Enums.EditorTypes.Any;

            // need to set tab explicitly if it's within an editor
            this.tab = null;

            this.readyCallbacks.push(function() {
                console.log('CANVAS READY: default canvas ready callback');
            });
            this.state = Common.Enums.State.Constructed;
        }

        public initialize($container?: any) {
            var self = this;
            if(Common.Utilities.isNotNullOrUndefined($container)) {
                this.container = $container[0]; // jquery lite converted to raw html
                this.$container = $container; // jquery lite object    
            } else if(Common.Utilities.isNullOrUndefined(this.$container)) {
                throw new Error('Canvas intialize: $container arg passed or existing canvas \
                    $container value is null or undefined. A jQuery HTML container element is \
                    required in order to intialize the canvas.');
            }
            
            this.setDimensions();

            // Grid will help the paper determine its sizing
            // and will be the basis for drawing objects' lengths and
            // dimensions.
            this.grid = this.grid || new Common.Models.Grid(
                this,
                Playbook.Constants.FIELD_COLS_FULL,
                Playbook.Constants.FIELD_ROWS_FULL
            );

            this.drawing = new Common.Drawing.Utilities(this, this.grid);

            // Paper methods within field are dependent on 
            // this.Raphael
            if(Common.Utilities.isNullOrUndefined(this.field))
                this.field = new Playbook.Models.EditorField(this);

            this.field.initialize();
            

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

            this.invokeListener('onready');
            this.state = Common.Enums.State.Ready;
        }

        public setDimensions(): void {
            this.dimensions.width = this.$container.width();
            this.dimensions.height = this.$container.height();
        }

        public resetHeight() {
            //this.height = this.$container.height(this.$container.height());
        }

        public getToolMode() {
            return this.toolMode;
        }

        public getToolModeName() {
            return Playbook.Enums.ToolModes[this.toolMode];
        }
    }
}
