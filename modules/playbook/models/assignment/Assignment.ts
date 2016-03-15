/// <reference path='../models.ts' />

module Playbook.Models {

	export class Assignment 
	extends Common.Models.Modifiable {

		public routes: Playbook.Models.RouteCollection;
		public positionIndex: number;
		public setType: Playbook.Editor.PlaybookSetTypes;

		constructor() {
			super(this);
			this.routes = new Playbook.Models.RouteCollection();
			this.positionIndex = -1;
			this.setType = Playbook.Editor.PlaybookSetTypes.Assignment;
		}

		public erase() {
			this.routes.forEach(function(route, index) {
				route.erase();
			});
		}

		public setContext(context: Playbook.Models.Player) {
			this.routes.forEach(function(route, index) {
				route.setContext(context);
			});
		}

		public fromJson(json: any) {
			if (!json)
				return;
			
			this.routes.fromJson(json.routes);
			this.positionIndex = json.positionIndex;
			this.guid = json.guid;
		}

		public toJson(): any {
			return {
				routes: this.routes.toJsonArray(),
				positionIndex: this.positionIndex,
				guid: this.guid
			}
		}
	}
}