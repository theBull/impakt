/// <reference path='./models.ts' />

module Playbook.Models {
    export class PreviewSideline
    extends Common.Models.Sideline {

        constructor(offsetX: number) {
            super(offsetX);
        }

        public initialize(field: Common.Interfaces.IField): void {
			super.initialize(field);
			this.graphics.opacity = 0.35;
        }
    }
}