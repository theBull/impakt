/// <reference path='./models.ts' />

module Team.Models {
    export class Personnel
    extends Common.Models.Modifiable {

        public unitType: Team.Enums.UnitTypes;
        public parentRK: number; // TODO @theBull - deprecate
        public editorType: Playbook.Enums.EditorTypes;
        public name: string;
        public associated: Common.Models.Association;
        public positions: Team.Models.PositionCollection;
        public setType: Common.Enums.SetTypes; // TODO @theBull - deprecate
        public key: number;

        constructor() {
            super();
            super.setContext(this);
            
            this.name = 'Untitled';
            this.unitType = Team.Enums.UnitTypes.Other;
            this.key = -1;
            this.positions = new Team.Models.PositionCollection();
            this.setDefault();
            this.setType = Common.Enums.SetTypes.Personnel;
            this.onModified(function(data) {
                console.log('personnel changed', data);
            });
            this.positions.onModified(function(data) {
                console.log('personnel positions changed', data);
            });
        }
        public hasPositions(): boolean {
            return this.positions && this.positions.size() > 0;
        }
        public update(personnel: Team.Models.Personnel) {
            this.unitType = personnel.unitType;
            this.key = personnel.key;
            this.name = personnel.name;
            this.guid = personnel.guid;
        }
        public copy(newPersonnel: Team.Models.Personnel): Team.Models.Personnel {
            return <Team.Models.Personnel>super.copy(newPersonnel, this);
        }
        public fromJson(json: any): any {
            if (!json)
                return null;
            this.positions.removeAll();
            this.positions.fromJson(json.positions);
            this.unitType = json.unitType;
            this.key = json.key;
            this.name = json.name;
            this.guid = json.guid;
        }
        public toJson(): any {
            return {
                name: this.name,
                unitType: this.unitType,
                key: this.key,
                positions: this.positions.toJson(),
                guid: this.guid
            }
        }
        public setDefault() {
            this.positions = Team.Models.PositionDefault.getBlank(this.unitType);
        }
        public setUnitType(unitType: Team.Enums.UnitTypes): void {
            this.unitType = unitType;
            this.setDefault();
        }
    }
}
