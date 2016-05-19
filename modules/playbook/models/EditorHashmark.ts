/// <reference path='./models.ts' />

module Playbook.Models {
    export class EditorHashmark
    extends Common.Models.Hashmark
    implements Common.Interfaces.IHashmark {

        constructor(offsetX: number) {
            super(offsetX);
        }
    }
}