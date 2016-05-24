/// <reference path='./models.ts' />

module Common.Models {

    export class AssignmentGroup
    extends Common.Models.AssociableEntity {

        public unitType: Team.Enums.UnitTypes;
        public name: string;
        public assignments: Common.Models.Collection<Common.Models.Assignment>;

        // at this point I'm expecting an object literal with data / count
        // properties, but not a valid AssignmentCollection; Essentially
        // this is to get around 
        constructor(unitType: Team.Enums.UnitTypes, count?: number) {
            super(Common.Enums.ImpaktDataTypes.AssignmentGroup);
            this.unitType = unitType;
            this.assignments = new Common.Models.Collection<Common.Models.Assignment>(11);
            
            if (count) {
                for (let i = 0; i < count; i++) {
                    let assignment = new Common.Models.Assignment(this.unitType);
                    assignment.positionIndex = i;
                    this.assignments.add(assignment);
                }
            }
            this.name = 'Untitled';
            this.key = -1;
            this.flipped = false;
            this.onModified(function() {
                // TODO
            });
        }

        public copy(newAssignmentGroup?: Common.Models.AssignmentGroup): Common.Models.AssignmentGroup {
            var copyAssignmentGroup = newAssignmentGroup || new Common.Models.AssignmentGroup(this.unitType);
            copyAssignmentGroup.assignments = this.assignments.copy();
            return <Common.Models.AssignmentGroup>super.copy(copyAssignmentGroup, this);
        }
        
        public toJson(): any {
            return $.extend({
                unitType: this.unitType,
                name: this.name,
                assignments: this.assignments.toJson()
            }, super.toJson());
        }
        public fromJson(json: any): any {
            if (!json)
                return;

            this.unitType = json.unitType;
            this.name = json.name;
            let assignments = json.assignments || [];
            for (let i = 0; i < assignments.length; i++) {
                let rawAssignment = assignments[i];
                if (Common.Utilities.isNullOrUndefined(rawAssignment))
                    continue;

                rawAssignment.unitType = Common.Utilities.isNotNullOrUndefined(rawAssignment.unitType) &&
                    rawAssignment.unitType >= 0 ? rawAssignment.unitTpe : Team.Enums.UnitTypes.Other;

                let assignmentModel = new Common.Models.Assignment(rawAssignment.unitType);
                assignmentModel.fromJson(rawAssignment);
                this.assignments.addAtIndex(assignmentModel, i);
            }
            super.fromJson(json);
        }
        public getAssignmentByPositionIndex(index: number) {
            let result = null;
            if (this.assignments.hasElements()) {
                result = this.assignments.filterFirst(function(assignment) {
                    return assignment.positionIndex == index;
                });
            }
            return result;
        }

        public flip(): void {
            if(Common.Utilities.isNotNullOrUndefined(this.assignments)) {
                this.assignments.forEach(function(assignment: Common.Models.Assignment, index: number) {
                    if(Common.Utilities.isNotNullOrUndefined(assignment))
                        assignment.flip();
                });
                this.flipped = !this.flipped;
            }
        }
    }
}
