/// <reference path='./models.ts' />

module Common.Models {
    
    export class PlaybookModelCollection
    extends Common.Models.ActionableCollection<Common.Models.PlaybookModel> {

        public unitType: Team.Enums.UnitTypes;

        constructor(unitType: Team.Enums.UnitTypes) {
            super();
            this.unitType = unitType;
        }
        public toJson(): any {
            return {
                guid: this.guid,
                playbooks: super.toJson(),
                unitType: this.unitType
            };
        }
        public fromJson(json: any): any {
            if (!json)
                return;
            this.guid = json.guid || this.guid;
            this.unitType = json.unitType;
            var playbooks = json.playbooks || [];
            for (var i = 0; i < playbooks.length; i++) {
                var rawPlaybook = playbooks[i];
                if (Common.Utilities.isNullOrUndefined(rawPlaybook))
                    continue;

                rawPlaybook.unitType = !Common.Utilities.isNullOrUndefined(rawPlaybook.unitType) &&
                    rawPlaybook.unitType >= 0 ? rawPlaybook.unitType : Team.Enums.UnitTypes.Mixed;

                // Allow mixed unit types to be added to the playbookmodel collection;
                // a variety of unit types may exist in a playbook model collection
                if(rawPlaybook.unitType != this.unitType) {
                    this.unitType = Team.Enums.UnitTypes.Mixed;
                }

                var playbookModel = new Common.Models.PlaybookModel(rawPlaybook.unitType);
                playbookModel.fromJson(rawPlaybook);
                this.add(playbookModel);
            }
        }
    }
}