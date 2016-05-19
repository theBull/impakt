/// <reference path='./models.ts' />

module Common.Models {

	export class ActionRegistry {
		
		public delete: Function[];
		public edit: Function[];
		public save: Function[];
		public update: Function[];
		public create: Function[];
		public details: Function[];

		constructor() {}



	}

}