/// <reference path='./models.ts' />

module Common.Models {

	export class Template 
	extends Common.Models.Storable {
		public url: string;
		public name: string;
		public data: any;
		constructor(name: string, url: string) {
			super();
			this.name = name;
			this.url = url;
			this.data = {};
		}
	}
	
}