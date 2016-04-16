/// <reference path='./models.ts' />

module Common.Models {

    export abstract class Ball 
    extends Common.Models.FieldElement {

        public offset: number;

        constructor(field: Common.Interfaces.IField) {
            super(field, null);

            this.layer.type = Common.Enums.LayerTypes.Ball;
            this.layer.graphics.fill = 'brown';
            this.layer.graphics.dimensions.setWidth(this.grid.getSize() * 0.15);
            this.layer.graphics.dimensions.setHeight(this.grid.getSize() * 0.25);
            this.layer.graphics.updateFromCoordinates(
                Playbook.Constants.BALL_DEFAULT_PLACEMENT_X,
                Playbook.Constants.BALL_DEFAULT_PLACEMENT_Y
            );
        }

        public draw(): void {
            this.layer.graphics.ellipse();
        }
    }
}
