/// <reference path='./models.ts' />

module Common.Models {
    export class PlayerCollection
        extends Common.Models.ModifiableCollection<Common.Interfaces.IPlayer> {
        constructor() {
            super();

            this.onModified(function() {
				console.log('player collection modified');
            });
        }
    }
}
