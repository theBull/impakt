/// <reference path='./models.ts' />

module Common.Models {

    export class AssignmentCollection
        extends Common.Models.ModifiableCollection<Common.Models.Assignment> {

        public setType: Common.Enums.SetTypes;
        public unitType: Team.Enums.UnitTypes;
        public name: string;
        public key: number;

        // at this point I'm expecting an object literal with data / count
        // properties, but not a valid AssignmentCollection; Essentially
        // this is to get around 
        constructor(count?: number) {
            super();
            if (count) {
                for (var i = 0; i < count; i++) {
                    var assignment = new Common.Models.Assignment();
                    assignment.positionIndex = i;
                    this.add(assignment);
                }
            }
            this.setType = Common.Enums.SetTypes.Assignment;
            this.unitType = Team.Enums.UnitTypes.Other;
            this.name = 'Untitled';
            this.key = -1;
        }
        
        public toJson(): any {
            return {
                unitType: this.unitType,
                setType: this.setType,
                guid: this.guid,
                key: this.key,
                assignments: super.toJson()
            }
        }
        public fromJson(json: any): any {
            if (!json)
                return;
            this.guid = json.guid;
            this.key = json.key;
            this.unitType = json.unitType;
            this.setType = json.setType;
            var assignments = json.assignments || [];
            for (var i = 0; i < assignments.length; i++) {
                var rawAssignment = assignments[i];
                var assignmentModel = new Common.Models.Assignment();
                assignmentModel.fromJson(rawAssignment);
                this.add(assignmentModel);
            }
        }
        public getAssignmentByPositionIndex(index: number) {
            var result = null;
            if (this.hasElements()) {
                result = this.filterFirst(function(assignment) {
                    return assignment.positionIndex == index;
                });
            }
            return result;
        }
    }
}
