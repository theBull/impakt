/// <reference path='../models.ts' />

module Playbook.Models {
    export class UnitTypeCollection
        extends Common.Models.ModifiableCollection<Playbook.Models.UnitType> {

        constructor() {
            super();
            var offense = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Offense, 'offense');
            this.add(offense);
            var defense = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Defense, 'defense');
            this.add(defense);
            var specialTeams = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.SpecialTeams, 'special teams');
            this.add(specialTeams);
            var other = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Other, 'other');
            this.add(other);
        }
        public getByUnitType(unitTypeValue: Playbook.Editor.UnitTypes) {
            return this.filterFirst(function(unitType) {
                return unitType.unitType == unitTypeValue;
            });
        }
        public getAssociatedPlaybooks() {
            var collection = new Playbook.Models.PlaybookModelCollection();
            this.forEach(function(unitType, index) {
                if (unitType && unitType.associated &&
                    unitType.associated.playbooks &&
                    unitType.associated.playbooks.hasElements()) {
                    unitType.associated.playbooks.forEach(function(guid, i) {
                        var playbookModel = impakt.context.Playbook.playbooks.get(guid);
                        if (playbookModel) {
                            collection.add(playbookModel);
                        }
                    });
                }
            });
            return collection;
        }
        public toJson() {
            return super.toJson();
        }
        // takes an unprocessed arry of playbooks from the server
        // and adds them into the collection and sub collections
        public fromJson(json) {
            if (!json)
                return;
            this.guid = json.guid || this.guid;
        }
    }
}
