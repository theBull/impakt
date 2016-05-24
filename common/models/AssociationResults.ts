/// <reference path='./models.ts' />

module Common.Models {

	export class AssociationResults {

		public playbooks: Common.Models.PlaybookModelCollection
		public plays: Common.Models.PlayCollection
		public formations: Common.Models.FormationCollection;
		public personnel: Team.Models.PersonnelCollection;
		public assignmentGroups: Common.Models.AssignmentGroupCollection;
		
	}
}