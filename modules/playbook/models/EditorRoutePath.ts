/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorRoutePath
	extends Common.Models.RoutePath
	implements Common.Interfaces.IRoutePath {

		constructor(route: Common.Interfaces.IRoute) {
			super(route);
		}
	}

}