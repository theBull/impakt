/// <reference path='./models.ts' />

module Common.Models {
    export class Formation
        extends Common.Models.AssociableEntity {

        public unitType: Team.Enums.UnitTypes;
        public parentRK: number; // TODO @theBull - deprecate
        public editorType: Playbook.Enums.EditorTypes;
        public placements: Common.Models.PlacementCollection;
        public png: string;

        constructor(unitType: Team.Enums.UnitTypes) {
            super(Common.Enums.ImpaktDataTypes.Formation);
            
            this.unitType = unitType;
            this.parentRK = 1;
            this.editorType = Playbook.Enums.EditorTypes.Formation;
            this.name = name || 'New formation';
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
            var copyFormation = newFormation || new Common.Models.Formation(this.unitType);
            return <Common.Models.Formation>super.copy(copyFormation, this);
        }
        public toJson() {
            return $.extend({
                name: this.name,
                parentRK: this.parentRK,
                unitType: this.unitType,
                editorType: this.editorType,
                placements: this.placements.toJson(),
                png: this.png
            }, super.toJson());
        }
        public fromJson(json: any): any {
            if (!json)
                return;
            
            var self = this;
            this.parentRK = json.parentRK;
            this.editorType = Playbook.Enums.EditorTypes.Formation;
            this.name = json.name;
            this.unitType = json.unitType;
            this.placements.fromJson(json.placements);
            this.png = json.png;

            super.fromJson(json);

            this.placements.onModified(function() {
                self.setModified(true);
            });
            this.onModified(function() {
                
            });
        }
        
        public setDefault(ball: Common.Interfaces.IBall) {
            if (!ball)
                throw new Error('Formation setDefault(): \
					Field reference is null or undefined');
            
            this.placements.removeAll();
            this.placements.addAll([
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
            ]);
        }
        public isValid() {
            // TODO add validation for 7 players on LOS
            return this.placements.size() == 11;
        }

        public setPlacements(placements: Common.Models.PlacementCollection) {
            this.placements = placements;
            this.setModified(true);
        }

        public setUnitType(unitType: Team.Enums.UnitTypes): void {
            this.unitType = unitType;
            this.setModified(true);
        }

        public flip(): void {
            if(Common.Utilities.isNotNullOrUndefined(this.placements)) {
                this.placements.flip();
                this.flipped = this.placements.flipped;
            }
        }
    }
}
