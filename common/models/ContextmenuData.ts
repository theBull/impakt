/// <reference path='./models.ts' />

module Common.Models {

	export class ContextmenuData {

		public data: Common.Interfaces.IContextual;
		public url: string;
		public pageX: number;
		public pageY: number;
		public message: string;

		constructor(data: Common.Interfaces.IContextual, pageX: number, pageY: number, message?: string) {
			this.data = data;
			this.url = data.contextmenuTemplateUrl;
			this.pageX = pageX;
			this.pageY = pageY;
			this.message = message || 'Contextmenu opened';
		}

	}
}