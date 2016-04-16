/// <reference path='./models.ts' />

module Common.Icons {
	export class Glyphicon {
		prefix: string = 'glyphicon glyphicon-';
		icon: string = 'asterisk';
		get name(): string {
			return this.prefix + this.icon;
		}
		set name(n: string) {
			this.name = n;
		}

		constructor(icon?: string) {
			this.icon = icon || this.icon;
		}
	}
}