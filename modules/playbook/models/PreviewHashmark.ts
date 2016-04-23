/// <reference path='./models.ts' />

module Playbook.Models {
    export class PreviewHashmark
    extends Common.Models.Hashmark
    implements Common.Interfaces.IHashmark {

        constructor(field: Common.Interfaces.IField, x: number) {
            super(field, x);
        }
    }
}