/// <reference path='./models.ts' />

module Playbook.Models {
    export class PreviewSideline
    extends Common.Models.Sideline {

        constructor(field: Common.Interfaces.IField, offsetX: number) {
            super(field, offsetX);
            this.layer.graphics.opacity = 0.35;
        }
    }
}