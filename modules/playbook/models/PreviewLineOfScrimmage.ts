/// <reference path='./models.ts' />


module Playbook.Models {

    export class PreviewLineOfScrimmage
    extends Common.Models.LineOfScrimmage {

        constructor(field: Common.Interfaces.IField) {
            super(field);
            this.layer.graphics.setOffsetXY(0, 2);
            this.layer.graphics.dimensions.setHeight(1);
        }
        public draw(): void {
            this.layer.graphics.rect();
            this.layer.graphics.disable();
        }
    }
}
