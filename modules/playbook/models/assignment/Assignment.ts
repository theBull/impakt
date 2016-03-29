/// <reference path='../models.ts' />

module Playbook.Models {
    export class Assignment
        extends Common.Models.Modifiable {
        public routes: Playbook.Models.RouteCollection;
        public positionIndex: number;
        public setType: Playbook.Editor.SetTypes;

        constructor() {
            super(this);
            this.routes = new Playbook.Models.RouteCollection();
            this.positionIndex = -1;
            this.setType = Playbook.Editor.SetTypes.Assignment;
        }
        public clear() {
            this.routes.forEach(function(route, index) {
                route.clear();
            });
        }
        public erase() {
            this.routes.forEach(function(route, index) {
                route.erase();
            });
        }
        public setContext(context) {
            this.routes.forEach(function(route, index) {
                route.setContext(context);
            });
        }
        public fromJson(json) {
            if (!json)
                return;
            this.routes.fromJson(json.routes);
            this.positionIndex = json.positionIndex;
            this.guid = json.guid;
        }
        public toJson() {
            return {
                routes: this.routes.toJson(),
                positionIndex: this.positionIndex,
                guid: this.guid
            }
        }
    }
}