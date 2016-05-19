/// <reference path='./models.ts' />


module Playbook.Models {

    export class PreviewLineOfScrimmage
    extends Common.Models.LineOfScrimmage {

        constructor() {
            super();
            
        }
        public initialize(field: Common.Interfaces.IField): void {
            super.initialize(field);
            this.graphics.setOffsetXY(0, 2);
            this.graphics.dimensions.setHeight(1);
            this.hoverable = false;
            this.selectable = false;
        }
        public draw(): void {
            this.graphics.rect();
            //this.graphics.disable();
        }
    }
}
