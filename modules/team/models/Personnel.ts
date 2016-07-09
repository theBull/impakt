/// <reference path='./models.ts' />

module Team.Models {
    export class Personnel
    extends Common.Models.AssociableEntity {

        public unitType: Team.Enums.UnitTypes;
        public parentRK: number; // TODO @theBull - deprecate
        public editorType: Playbook.Enums.EditorTypes;
        public positions: Team.Models.PositionCollection;
        public setType: Common.Enums.SetTypes; // TODO @theBull - deprecate

        constructor(unitType: Team.Enums.UnitTypes) {
            super(Common.Enums.ImpaktDataTypes.PersonnelGroup);
            
            this.name = 'Untitled';
            this.unitType = unitType;
            this.positions = null;
            this.setType = Common.Enums.SetTypes.Personnel;
            this.onModified(function(data) {});
        }
        public copy(newPersonnel?: Team.Models.Personnel): Team.Models.Personnel {
            let copyPersonnel = newPersonnel || new Team.Models.Personnel(this.unitType);
            return <Team.Models.Personnel>super.copy(copyPersonnel, this);
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
        public fromJson(json: any): any {
            if (!json)
                return null;

            this.unitType = json.unitType;
            if(!this.positions) {
                this.positions = new Team.Models.PositionCollection(this.unitType);
            } else {
                this.positions.removeAll();
            }
            this.positions.fromJson(json.positions);    
            this.name = json.name;

            super.fromJson(json);
        }
        public toJson(): any {
            return $.extend({
                name: this.name,
                unitType: this.unitType,
                positions: this.positions.toJson()
            }, super.toJson());
        }
        public setDefault() {
            this.positions = Team.Models.PositionDefault.getBlank(this.unitType);
            this.positions.onModified(function(data) { });
        }
        public setUnitType(unitType: Team.Enums.UnitTypes): void {
            this.unitType = unitType;
            this.setDefault();
        }
    }
}
