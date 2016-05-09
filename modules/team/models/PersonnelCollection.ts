/// <reference path='./models.ts' />

module Team.Models {
    export class PersonnelCollection
    extends Common.Models.ModifiableCollection<Team.Models.Personnel> {
        
        public unitType: Team.Enums.UnitTypes;
        public setType: Common.Enums.SetTypes;

        constructor(unitType: Team.Enums.UnitTypes) {
            super();
            this.unitType = unitType;
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
                if(Common.Utilities.isNullOrUndefined(rawPersonnel)) {
                    continue;
                }
                rawPersonnel.unitType = Common.Utilities.isNullOrUndefined(rawPersonnel.unitType) &&
                    rawPersonnel.unitType >= 0 ? rawPersonnel.unitType : Team.Enums.UnitTypes.Other;
                    
                var personnelModel = new Team.Models.Personnel(rawPersonnel.unitType);
                personnelModel.fromJson(rawPersonnel);
                this.add(personnelModel);
            }
        }
    }
}
