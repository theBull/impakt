/// <reference path='../models.ts' />

module Playbook.Models {
    export class Hashmark
    extends Playbook.Models.FieldElement {

        public offset: number;
        public start: number;
        public yards: number;

        constructor(field: Playbook.Interfaces.IField, offset: number) {
            super(field);

            // hash marks should be -x- grid units from center
            this.offset = offset || 3;
            this.placement.coordinates.x = this.grid.getCenter().x + this.offset;
            this.placement.coordinates.y = 0;
            this.width = (this.grid.getSize() / 2);
            this.height = 1;
            this.start = 11;
            this.yards = 110;
            this.opacity = 0.9;
            this.color = '#ffffff';
        }
        public draw(): void {
            for (var i = this.start; i < this.yards; i++) {
                this.raphael = this.paper.rect(this.placement.coordinates.x, i, this.width, this.height).attr({
                    'fill': this.color,
                    'fill-opacity': this.opacity,
                    'stroke-width': 0
                });
                this.paper.bump(-(this.width / 2), 0, this.raphael);
            }
        }
    }
}