/// <reference path='./models.ts' />

module Common.Models {

    export class AssignmentGroupCollection
    extends Common.Models.ActionableCollection<Common.Models.AssignmentGroup> {

        public unitType: Team.Enums.UnitTypes;

        // at this point I'm expecting an object literal with data / count
        // properties, but not a valid AssignmentCollection; Essentially
        // this is to get around 
        constructor(unitType: Team.Enums.UnitTypes) {
            super();
            this.unitType = unitType;

            this.onModified(function() {
                // TODO
            });
        }
        
        public toJson(): any {
            return {
                unitType: this.unitType,
                assignmentCollections: super.toJson()
            }
        }
        public fromJson(json: any): any {
            if (!json)
                return;

            this.unitType = json.unitType;

            let assignmentCollections = json.assignmentCollections || [];
            for (let i = 0; i < assignmentCollections.length; i++) {
                let rawAssignmentCollection = assignmentCollections[i];
                if (Common.Utilities.isNullOrUndefined(rawAssignmentCollection))
                    continue;

                rawAssignmentCollection.unitType = 
                    !Common.Utilities.isNullOrUndefined(rawAssignmentCollection.unitType) &&
                    rawAssignmentCollection.unitType >= 0 ? 
                    rawAssignmentCollection.unitTpe : 
                    Team.Enums.UnitTypes.Other;

                let assignmentCollection = new Common.Models.AssignmentGroup(rawAssignmentCollection.unitType);
                assignmentCollection.fromJson(rawAssignmentCollection);
                this.add(assignmentCollection);
            }
        }
    }
}
