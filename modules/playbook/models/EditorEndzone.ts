/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class EditorEndzone 
    extends Common.Models.Endzone
    implements Common.Interfaces.IEndzone {

        constructor(
            context: Common.Interfaces.IField, 
            offsetY: number
        ) {
            super(context, offsetY);
        }
    }
}