/// <reference path='./models.ts' />


module Team.Models {
    export class UnitType
        extends Common.Models.Modifiable {

        public unitType: Team.Enums.UnitTypes;
        public name: string;

        constructor(unitType: Team.Enums.UnitTypes, name: string) {
            super();
            super.setContext(this);
            
            this.unitType = unitType;
            this.name = name;
        }
        public static getUnitTypes() {
            return Common.Utilities.convertEnumToList(Team.Enums.UnitTypes);
        }
        public toJson(): any {
            let json = {
                unitType: this.unitType,
                name: this.name,
                guid: this.guid
            };
            return json;
        }
        public fromJson(json: any): any {
            if (!json)
                return;
            this.unitType = json.unitType;
            this.name = json.name;
            this.guid = json.guid;
        }
    }
}