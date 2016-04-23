/// <reference path='./models.ts' />

module Common.Models {
    export class Formation
        extends Common.Models.Modifiable {

        public unitType: Team.Enums.UnitTypes;
        public parentRK: number; // TODO @theBull - deprecate
        public editorType: Playbook.Enums.EditorTypes;
        public name: string;
        public associated: Common.Models.Association;
        public placements: Common.Models.PlacementCollection;
        public key: number;
        public png: string;

        constructor(name?: string) {
            super();
            super.setContext(this);
            
            this.unitType = Team.Enums.UnitTypes.Other;
            this.parentRK = 1;
            this.editorType = Playbook.Enums.EditorTypes.Formation;
            this.name = name || 'New formation';
            this.associated = new Common.Models.Association();
            this.placements = new Common.Models.PlacementCollection();
            this.png = null;
            //this.setDefault();
            
            let self = this;
            this.onModified(function() {});
            this.placements.onModified(function() {
                self.setModified(true);
            });
        }
        public copy(newFormation?: Common.Models.Formation): Common.Models.Formation {
            var copyFormation = newFormation || new Common.Models.Formation();
            return <Common.Models.Formation>super.copy(copyFormation, this);
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
            this.editorType = Playbook.Enums.EditorTypes.Formation;
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
        public setDefault(ball: Common.Interfaces.IBall) {
            if (!ball)
                throw new Error('Formation setDefault(): \
					Field reference is null or undefined');
            
            this.placements.removeAll();
            this.placements.addAll(
                new Common.Models.Placement(0, -1, ball, 0), 
                new Common.Models.Placement(1.5, -1, ball, 1), 
                new Common.Models.Placement(-1.5, -1, ball, 2), 
                new Common.Models.Placement(-3, -1, ball, 3), 
                new Common.Models.Placement(3, -1, ball, 4), 
                new Common.Models.Placement(0, -2, ball, 5), 
                new Common.Models.Placement(-4, -2, ball, 6), 
                new Common.Models.Placement(-16, -1, ball, 7), 
                new Common.Models.Placement(14, -1, ball, 8), 
                new Common.Models.Placement(0, -4, ball, 9), 
                new Common.Models.Placement(0, -6, ball, 10)
            );
        }
        public isValid() {
            // TODO add validation for 7 players on LOS
            return this.placements.size() == 11;
        }
        public setPlacements(placements: Common.Models.PlacementCollection) {
            this.placements = placements;
            this.setModified(true);
        }
    }
}
