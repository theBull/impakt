/// <reference path='../models.ts' />


module Playbook.Models {

    export class LineOfScrimmage
    extends Playbook.Models.FieldElement {

        public field: Playbook.Interfaces.IField;
        public y: number;
        public LOS_Y_OFFSET: number;

        constructor(field: Playbook.Interfaces.IField) {
            super(field);
            this.field = field;
            if (!this.field || !this.field.ball)
                throw new Error('LineOfScrimmage constructor(): field/ball are null or undefined');
            this.LOS_Y_OFFSET = 8;
            this.placement.coordinates.x = 0;
            this.placement.coordinates.y = this.field.ball.placement.coordinates.y;
            this.width = this.grid.width;
            this.height = 4;
            this.color = 'yellow';
            this.opacity = 1;
        }
        public draw(): void {
            this.paper.rect(
                this.placement.coordinates.x, 
                this.placement.coordinates.y, 
                this.width, 
                this.height
            ).click(this.click).attr({
                'fill': this.color,
                'fill-opacity': this.opacity,
                'stroke-width': 0
            });
            // todo: attach drag functionality
            // drag when moving ball
        }
    }
}
