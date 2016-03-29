/// <reference path='../models.ts' />

module Playbook.Models {
    export class RouteCollection
        extends Common.Models.ModifiableCollection<Playbook.Models.Route> {

        constructor() {
            super();
        }
        public toJson() {
            return {
                guid: this.guid,
                rotues: super.toJson()
            };
        }
        public fromJson(json) {
            var routes = json.routes || [];
            for (var i = 0; i < routes.length; i++) {
                var rawRoute = routes[i];
                var routeModel = new Playbook.Models.Route(null);
                routeModel.fromJson(rawRoute);
                this.add(routeModel);
            }
        }
    }
}