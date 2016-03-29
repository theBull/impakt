/// <reference path='../models.ts' />

module Playbook.Models {
    export class Endzone extends Playbook.Models.FieldElement {
        constructor(
            context: Playbook.Interfaces.IField, 
            offsetY: number
        ) {
            super(context);
            this.context = context;
            this.color = 'black';
            this.opacity = 0.25;
            this.placement = new Playbook.Models.Placement(0, 0, null);
            this.placement.coordinates.x = 1;
            this.placement.coordinates.y = offsetY || 0;
            this.width = this.paper.getWidth() -
                (2 * this.grid.getSize());
            this.height = 10 * this.grid.getSize();
        }
        public draw(): void {
            var rect = this.paper.rect(
                this.placement.coordinates.x, 
                this.placement.coordinates.y, 
                this.width, 
                this.height
            ).attr({
                'fill': this.color,
                'fill-opacity': this.opacity
            });
        };
    }
}