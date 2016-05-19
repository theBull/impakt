/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class EditorEndzone 
    extends Common.Models.Endzone
    implements Common.Interfaces.IEndzone {

        constructor(offsetY: number) {
            super(offsetY);
        }

        public initialize(field: Common.Interfaces.IField) {
            super.initialize(field);
        }
    }
}