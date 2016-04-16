/// <reference path='./models.ts' />

module Common.Models {
    export class Assignment
        extends Common.Models.Modifiable {
            
        public routes: Common.Models.RouteCollection;
        public positionIndex: number;
        public setType: Common.Enums.SetTypes;

        constructor() {
            super();
            super.setContext(this);

            this.routes = new Common.Models.RouteCollection();
            this.positionIndex = -1;
            this.setType = Common.Enums.SetTypes.Assignment;
        }

        public remove() {
            this.routes.forEach(function(route, index) {
                route.remove();
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