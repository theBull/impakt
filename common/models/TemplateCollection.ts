/// <reference path='./models.ts' />

module Common.Models {
	export class TemplateCollection
	extends Common.Models.Collection<Common.Models.Template> {
		public name: string;
		constructor(name: string) {
			super();
			this.name = name;
		}
	}
}