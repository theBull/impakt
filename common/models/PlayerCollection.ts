/// <reference path='./models.ts' />

module Common.Models {
    export class PlayerCollection
        extends Common.Models.Collection<Common.Interfaces.IPlayer> {
        constructor() {
            super();

            this.onModified(function() {});
        }
    }
}
