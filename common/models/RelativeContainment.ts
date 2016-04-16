/// <reference path='./models.ts' />

module Common.Models {

	export class RelativeContainment
	extends Common.Models.Containment {

		constructor(left: number, right: number, top: number, bottom: number) {
			super(left, right, top, bottom);
		}
	}
}