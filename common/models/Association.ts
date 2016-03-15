/// <reference path='./models.ts' />

module Common.Models {

	/**
	 * Associates an element with one or more other elements
	 * by guid.
	 */
	export class Association
	extends Common.Models.Modifiable {

		public unitTypes: string[];
		public playbooks: string[];
		public formations: string[];
		public personnel: string[];
		public assignments: string[];
		public plays: string[];
		public guid: string;
		
		constructor() {
			super(this);
			this.unitTypes = [];
			this.playbooks = [];
			this.formations = [];
			this.personnel = [];
			this.assignments = [];
			this.plays = [];
		}

		public toJson(): any {
			return {
				unitTypes: this.unitTypes,
				playbooks: this.playbooks,
				formations: this.formations,
				personnel: this.personnel,
				assignments: this.assignments,
				plays: this.plays,
				guid: this.guid
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.unitTypes = json.unitTypes || this.unitTypes;
			this.playbooks = json.playbooks || this.playbooks;
			this.formations = json.formations || this.formations;
			this.personnel = json.personnel || this.personnel;
			this.assignments = json.assignments || this.assignments;
			this.plays = json.plays || this.plays;
			this.guid = json.guid || this.guid;
		}

	}
}