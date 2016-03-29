/// <reference path='../models.ts' />

module Playbook.Models {
    export class Sideline
        extends Playbook.Models.FieldElement {
        public offset: number;
        constructor(field: Playbook.Interfaces.IField, offset: number) {
            super(field);
            this.field = field;
            this.color = 'white';
            this.opacity = 1;
            this.placement.coordinates.x = this.grid.getCenter().x;
            this.placement.coordinates.y = 0;
            this.width = this.grid.getSize();
            this.height = this.grid.getHeight();
            this.offset = offset || 0;
        }
        public draw(): void {
            // adjust the left sideline so that it does not overlap the grid
            // by shifting it left by its width so that its right edge aligns
            // with the gridline
            var bumpX = this.offset < 0 ? -this.width : 0;
            var rect = this.paper.rect(this.placement.coordinates.x + this.offset, this.placement.coordinates.y, this.width, this.height).attr({
                'fill': this.color,
                'fill-opacity': this.opacity,
                'stroke-width': 0
            });
            this.paper.bump(bumpX, 0, rect);
        }
    }
}