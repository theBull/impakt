/// <reference path='../models.ts' />

module Playbook.Models {
    export class Formation
        extends Common.Models.Modifiable {

        public unitType: Playbook.Editor.UnitTypes;
        public parentRK: number; // TODO @theBull - deprecate
        public editorType: Playbook.Editor.EditorTypes;
        public name: string;
        public associated: Common.Models.Association;
        public placements: Playbook.Models.PlacementCollection;
        public key: number;
        public png: string;

        constructor(name?: string) {
            super(this);
            this.unitType = Playbook.Editor.UnitTypes.Other;
            this.parentRK = 1;
            this.editorType = Playbook.Editor.EditorTypes.Formation;
            this.name = name || 'untitled';
            this.associated = new Common.Models.Association();
            this.placements = new Playbook.Models.PlacementCollection();
            this.png = null;
            //this.setDefault();
        }
        public copy(newFormation?: Playbook.Models.Formation): Playbook.Models.Formation {
            var copyFormation = newFormation || new Playbook.Models.Formation();
            return <Playbook.Models.Formation>super.copy(copyFormation, this);
        }
        public toJson() {
            return $.extend(super.toJson(), {
                name: this.name,
                key: this.key,
                parentRK: this.parentRK,
                unitType: this.unitType,
                editorType: this.editorType,
                guid: this.guid,
                associated: this.associated.toJson(),
                placements: this.placements.toJson(),
                png: this.png
            });
        }
        public fromJson(json: any): any {
            if (!json)
                return;
            var self = this;
            super.fromJson(json);
            this.parentRK = json.parentRK;
            this.editorType = Playbook.Editor.EditorTypes.Formation;
            this.name = json.name;
            this.guid = json.guid;
            this.unitType = json.unitType;
            this.placements.fromJson(json.placements);
            this.key = json.key;
            this.associated.fromJson(json.associated);
            this.png = json.png;
            this.placements.onModified(function() {
                console.log('formation modified: placement collection:', self.guid);
                self.setModified(true);
            });
            this.onModified(function() {
                console.log('formation modified?', self.modified);
            });
        }
        public setDefault(ball: Playbook.Models.Ball) {
            if (!ball)
                throw new Error('Formation setDefault(): \
					Field reference is null or undefined');
            this.placements.removeAll();
            this.placements.addAll(
                new Playbook.Models.Placement(0, -1, ball, 0), 
                new Playbook.Models.Placement(1.5, -1, ball, 1), 
                new Playbook.Models.Placement(-1.5, -1, ball, 2), 
                new Playbook.Models.Placement(-3, -1, ball, 3), 
                new Playbook.Models.Placement(-6, -1, ball, 4), 
                new Playbook.Models.Placement(0, -2, ball, 5), 
                new Playbook.Models.Placement(-4, -2, ball, 6), 
                new Playbook.Models.Placement(-16, -1, ball, 7), 
                new Playbook.Models.Placement(14, -1, ball, 8), 
                new Playbook.Models.Placement(0, -4, ball, 9), 
                new Playbook.Models.Placement(0, -6, ball, 10)
            );
        }
        public isValid() {
            // TODO add validation for 7 players on LOS
            return this.placements.size() == 11;
        }
    }
}
