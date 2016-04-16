/// <reference path='./models.ts' />

module Team.Models {
    export class PersonnelCollection
    extends Common.Models.ModifiableCollection<Team.Models.Personnel> {
        
        public unitType: Team.Enums.UnitTypes;
        public setType: Common.Enums.SetTypes;

        constructor() {
            super();
            this.unitType = Team.Enums.UnitTypes.Other;
            this.setType = Common.Enums.SetTypes.Personnel;
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
                var personnelModel = new Team.Models.Personnel();
                personnelModel.fromJson(rawPersonnel);
                this.add(personnelModel);
            }
        }
    }
}
