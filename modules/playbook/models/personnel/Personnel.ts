/// <reference path='../models.ts' />

module Playbook.Models {
    export class Personnel
    extends Common.Models.Modifiable {

        public unitType: Playbook.Editor.UnitTypes;
        public parentRK: number; // TODO @theBull - deprecate
        public editorType: Playbook.Editor.EditorTypes;
        public name: string;
        public associated: Common.Models.Association;
        public positions: Playbook.Models.PositionCollection;
        public setType: Playbook.Editor.SetTypes; // TODO @theBull - deprecate
        public key: number;

        constructor() {
            super(this);
            this.name = 'Untitled';
            this.unitType = Playbook.Editor.UnitTypes.Other;
            this.key = -1;
            this.positions = new Playbook.Models.PositionCollection();
            this.setDefault();
            this.setType = Playbook.Editor.SetTypes.Personnel;
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
        public update(personnel: Playbook.Models.Personnel) {
            this.unitType = personnel.unitType;
            this.key = personnel.key;
            this.name = personnel.name;
            this.guid = personnel.guid;
        }
        public copy(newPersonnel: Playbook.Models.Personnel): Playbook.Models.Personnel {
            return <Playbook.Models.Personnel>super.copy(newPersonnel, this);
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
            this.positions = Playbook.Models.PositionDefault.getBlank(this.unitType);
        }
        public setUnitType(unitType: Playbook.Editor.UnitTypes): void {
            this.unitType = unitType;
            this.setDefault();
        }
    }
}
