/// <reference path='../models.ts' />

module Playbook.Models {
    export class PersonnelCollection
    extends Common.Models.ModifiableCollection<Playbook.Models.Personnel> {
        
        public unitType: Playbook.Editor.UnitTypes;
        public setType: Playbook.Editor.SetTypes;

        constructor() {
            super();
            this.unitType = Playbook.Editor.UnitTypes.Other;
            this.setType = Playbook.Editor.SetTypes.Personnel;
        }
        public toJson() {
            return {
                unitType: this.unitType,
                setType: this.setType,
                personnel: super.toJson()
            }
        }
        public fromJson(json) {
            if (!json)
                return;
            this.unitType = json.unitType;
            this.guid = json.guid;
            this.setType = json.setType;
            var personnelArray = json.personnel || [];
            for (var i = 0; i < personnelArray.length; i++) {
                var rawPersonnel = personnelArray[i];
                var personnelModel = new Playbook.Models.Personnel();
                personnelModel.fromJson(rawPersonnel);
                this.add(personnelModel);
            }
        }
    }
}
