/// <reference path='../models.ts' />

module Playbook.Models {

	export class RouteCollection
		extends Common.Models.ModifiableCollection<Playbook.Models.Route> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				rotues: super.toJson()
			}
		}

		public fromJson(json: any) {

			let routes = json.routes || [];

			for (let i = 0; i < routes.length; i++) {
				let rawRoute = routes[i];

				let routeModel = new Playbook.Models.Route(null);
				routeModel.fromJson(rawRoute);

				this.add(routeModel);
			}
		}
	}
}