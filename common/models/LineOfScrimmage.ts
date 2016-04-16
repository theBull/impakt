/// <reference path='./models.ts' />

module Common.Models {

    export abstract class LineOfScrimmage
    extends Common.Models.FieldElement {

        constructor(field: Common.Interfaces.IField) {
            super(field,  null);

            this.layer.type = Common.Enums.LayerTypes.LineOfScrimmage;
            this.layer.graphics.fill = 'yellow';
            this.layer.graphics.strokeWidth = 0;
            this.layer.graphics.dimensions.setWidth(this.grid.dimensions.width - (this.grid.getSize()) * 2);
            this.layer.graphics.updateFromCoordinates(
                1,
                this.field.ball.layer.graphics.placement.coordinates.y
            );
        }
    }
}
