/// <reference path='./models.ts' />

module Common.Models {

    export class AssignmentCollection
    extends Common.Models.AssociableCollectionEntity<Common.Models.Assignment> {

        public setType: Common.Enums.SetTypes;
        public unitType: Team.Enums.UnitTypes;
        public name: string;

        // at this point I'm expecting an object literal with data / count
        // properties, but not a valid AssignmentCollection; Essentially
        // this is to get around 
        constructor(unitType: Team.Enums.UnitTypes, count?: number) {
            super(Common.Enums.ImpaktDataTypes.AssignmentGroup);
            this.unitType = unitType;
            if (count) {
                for (var i = 0; i < count; i++) {
                    var assignment = new Common.Models.Assignment(this.unitType);
                    assignment.positionIndex = i;
                    this.add(assignment);
                }
            }
            this.setType = Common.Enums.SetTypes.Assignment;
            this.name = 'Untitled';
        }
        
        public toJson(): any {
            return {
                unitType: this.unitType,
                setType: this.setType,
                assignments: super.toJson()
            }
        }
        public fromJson(json: any): any {
            if (!json)
                return;

            this.unitType = json.unitType;
            this.setType = json.setType;
            var assignments = json.assignments || [];
            for (var i = 0; i < assignments.length; i++) {
                var rawAssignment = assignments[i];
                if (Common.Utilities.isNullOrUndefined(rawAssignment))
                    continue;

                rawAssignment.unitType = !Common.Utilities.isNullOrUndefined(rawAssignment.unitType) &&
                    rawAssignment.unitType >= 0 ? rawAssignment.unitTpe : Team.Enums.UnitTypes.Other;

                var assignmentModel = new Common.Models.Assignment(rawAssignment.unitType);
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
