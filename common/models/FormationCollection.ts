/// <reference path='./models.ts' />

module Common.Models {
    
    export class FormationCollection
    extends Common.Models.ActionableCollection<Common.Models.Formation> {

        public parentRK: number; // TODO @theBull - deprecate
        public unitType: Team.Enums.UnitTypes;

        // at this point I'm expecting an object literal with data / count
        // properties, but not a valid FormationCollection; Essentially
        // this is to get around 
        constructor(unitType: Team.Enums.UnitTypes) {
            super();
            this.parentRK = -1;
            this.unitType = unitType;
            this.onModified(function() {});
        }
        public toJson() {
            return {
                formations: super.toJson(),
                unitType: this.unitType,
                guid: this.guid
            }
        }
        public fromJson(json: any): any {
            if (!json)
                return;

            // this.guid = json.guid || this.guid;
            // this.unitType = json.unitType || this.unitType;
            // this.parentRK = json.parentRK || this.parentRK
            let self = this;
            let formations = json || [];
            for (let i = 0; i < formations.length; i++) {
                let rawFormation = formations[i];
                if (Common.Utilities.isNullOrUndefined(rawFormation))
                    continue;
                rawFormation.unitType = !Common.Utilities.isNullOrUndefined(rawFormation.unitType) &&
                    rawFormation.unitType >= 0 ? rawFormation.unitType : Team.Enums.UnitTypes.Other;

                let formationModel = new Common.Models.Formation(rawFormation.unitType);
                formationModel.fromJson(rawFormation);
                this.add(formationModel);
            }
            this.forEach(function(formation, index) {
                formation.onModified(function() {
                    console.log('formation collection modified: formation');
                    self.setModified(true);
                });
            });
        }
    }
}