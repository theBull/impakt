/// <reference path='./models.ts' />

module Common.Models {
	export class Storable {
		public guid: string;
		constructor() {
			this.guid = Common.Utilities.guid();
		}
	}
}