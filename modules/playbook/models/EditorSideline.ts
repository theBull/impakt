/// <reference path='./models.ts' />

module Playbook.Models {
    export class EditorSideline
    extends Common.Models.Sideline {

        constructor(field: Common.Interfaces.IField, offsetX: number) {
            super(field, offsetX);
        }
    }
}