/// <reference path='./models.ts' />

module Common.Models {

    export abstract class LineOfScrimmage
    extends Common.Models.FieldElement {

        constructor() {
            super();
        }

        public initialize(field: Common.Interfaces.IField): void {
            super.initialize(field, null);
            this.layer.type = Common.Enums.LayerTypes.LineOfScrimmage;
            this.graphics.setOriginalFill('yellow');
            this.graphics.setOriginalStrokeWidth(0);
            this.graphics.setOriginalOpacity(1);
            this.graphics.dimensions.width = this.grid.dimensions.width - (this.grid.getSize() * 2);
            this.graphics.dimensions.height = 1;
            this.graphics.initializePlacement(
                new Common.Models.Placement(
                    1, 
                    this.field.ball.graphics.placement.coordinates.y,
                    null
                )
            );
        }
    }
}
