/// <reference path='./models.ts' />

module Common.Models {
	export class Storable {

		public guid: string;
		
		constructor() {
			this.guid = Common.Utilities.guid();
		}

		public toJson(): any {
			return {
				guid: this.guid
			}
		}

		public fromJson(json: any): any {
			if (!json)
				return;
			this.guid = json.guid;
		}
	}
}