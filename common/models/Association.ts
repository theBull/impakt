/// <reference path='./models.ts' />

module Common.Models {

	/**
	 * Associates an element with one or more other elements
	 * by guid.
	 */
	export class Association
	extends Common.Models.Modifiable {

		public playbooks: Common.Models.AssociationArray;
		public formations: Common.Models.AssociationArray;
		public personnel: Common.Models.AssociationArray;
		public assignments: Common.Models.AssociationArray;
		public plays: Common.Models.AssociationArray;
		public guid: string;
		
		constructor() {
			super();
			super.setContext(this);
			
			this.playbooks = new Common.Models.AssociationArray();
			this.formations = new Common.Models.AssociationArray();
			this.personnel = new Common.Models.AssociationArray();
			this.assignments = new Common.Models.AssociationArray();
			this.plays = new Common.Models.AssociationArray();
		}

		public toJson(): any {
			let self = this;
			return {
				playbooks: self.playbooks.toJson(),
				formations: self.formations.toJson(),
				personnel: self.personnel.toJson(),
				assignments: self.assignments.toJson(),
				plays: self.plays.toJson(),
				guid: self.guid
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.playbooks.addAll(json.playbooks)
			this.formations.addAll(json.formations)
			this.personnel.addAll(json.personnel);
			this.assignments.addAll(json.assignments);
			this.plays.addAll(json.plays);
			this.guid = json.guid || this.guid;
		}

	}
}