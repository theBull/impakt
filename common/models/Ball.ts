/// <reference path='./models.ts' />

module Common.Models {

    export abstract class Ball 
    extends Common.Models.FieldElement {

        public offset: number;

        constructor() {
            super();
        }

        public initialize(field: Common.Interfaces.IField) {
            super.initialize(field, null);
            this.layer.type = Common.Enums.LayerTypes.Ball;
            this.graphics.fill = 'brown';
            this.graphics.dimensions.setWidth(this.grid.getSize() * 0.15);
            this.graphics.dimensions.setHeight(this.grid.getSize() * 0.25);
            this.graphics.updateFromCoordinates(
                Playbook.Constants.BALL_DEFAULT_PLACEMENT_X,
                Playbook.Constants.BALL_DEFAULT_PLACEMENT_Y
            );
        }

        public draw(): void {
            this.graphics.ellipse();
        }
    }
}
