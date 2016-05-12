/// <reference path='./models.ts' />

module Common.Models {
	
	export class Quote {

		public quote: string;
		public author: string;

		constructor(quote: string, author: string) {
			this.quote = quote;
			this.author = author;
		}
	}
}