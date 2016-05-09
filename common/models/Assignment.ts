/// <reference path='./models.ts' />

module Common.Models {
    export class Assignment
    extends Common.Models.AssociableEntity {
            
        public routes: Common.Models.RouteCollection;
        public positionIndex: number;
        public setType: Common.Enums.SetTypes;
        public unitType: Team.Enums.UnitTypes;

        constructor(unitType: Team.Enums.UnitTypes) {
            super(Common.Enums.ImpaktDataTypes.Assignment);
            super.setContext(this);

            this.unitType = unitType;
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
            this.unitType = json.unitType;
            
            super.fromJson(json);
        }
        public toJson() {
            return $.extend({
                routes: this.routes.toJson(),
                positionIndex: this.positionIndex,
                unitType: this.unitType
            }, super.toJson());
        }
    }
}