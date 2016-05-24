/// <reference path='./models.ts' />

module Common.Models {
    export class Assignment
    extends Common.Models.AssociableEntity {
            
        public routes: Common.Models.RouteCollection;
        public routeArray: any[];
        public positionIndex: number;
        public setType: Common.Enums.SetTypes;
        public unitType: Team.Enums.UnitTypes;

        constructor(unitType: Team.Enums.UnitTypes) {
            super(Common.Enums.ImpaktDataTypes.Assignment);
            super.setContext(this);

            this.unitType = unitType;
            this.routes = new Common.Models.RouteCollection();
            this.routeArray = [];
            this.positionIndex = -1;
            this.setType = Common.Enums.SetTypes.Assignment;

            let self = this;
            this.routes.onModified(function() {
                self.setModified(true);
            });
        }

        public remove() {
            this.routes.removeAll();
        }

        public setContext(context) {
            this.routes.forEach(function(route: Common.Interfaces.IRoute, index: number) {
                route.setContext(context);
            });
        }

        public draw(): void {
            this.routes.forEach(function(route: Common.Interfaces.IRoute, index: number) {
                route.draw();
            });
        }

        public setRoutes(player: Common.Interfaces.IPlayer, renderType: Common.Enums.RenderTypes) {
            // intiialize the routeArray json for transferrence between
            // different rendering types for editor and preview modes

            if (!this.hasRouteArray() && this.routes.isEmpty())
                // no route data! skip ahead...
                return;

            if(this.routes.hasElements()) {
                // we have routes but no generic route json; we need to
                // convert the routes into json so that we can convert
                // the routes between preview/editor/etc. modes.
                this.routeArray = this.routes.toJson();
            }
            
            let routesToAdd: Array<Common.Interfaces.IRoute> = [];
            for (let i = 0; i < this.routeArray.length; i++) {
                let routeJson = this.routeArray[i];
                if (Common.Utilities.isNotNullOrUndefined(routeJson)) {
                    let route = null;
                    switch (renderType) {
                        case Common.Enums.RenderTypes.Preview:
                            route = new Playbook.Models.PreviewRoute();
                            break;
                        case Common.Enums.RenderTypes.Editor:
                            route = new Playbook.Models.EditorRoute();
                            break;
                    }
                    if (Common.Utilities.isNullOrUndefined(route))
                        throw new Error('Assignment setRoutes(): converted route is null or undefined');

                    // NOTE: must setPlayer() before calling fromJson ( >:/ )
                    // set the player context on the route
                    route.setPlayer(player);

                    // convert json into respective type
                    route.fromJson(routeJson);
                    routesToAdd.push(route);
                }
            }

            if(routesToAdd.length > 0) {
                this.routes.listen(false);
                this.routes.addAll(routesToAdd);       
                this.routes.listen(true);
            }
        }

        public hasRouteArray(): boolean {
            return this.routeArray && this.routeArray.length > 0;
        }

        public fromJson(json) {
            if (!json)
                return;
            
            // NOTE:
            // Route models rely on the presence of a field
            // object in order to be constructed ( :-/ )
            // for now, avoid serializing
            this.routeArray = json.routes;
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

        public flip(): void {
            if(Common.Utilities.isNotNullOrUndefined(this.routes)) {
                this.routes.forEach(function(route: Common.Interfaces.IRoute, index: number) {
                    if(Common.Utilities.isNotNullOrUndefined(route))
                        route.flip();
                });
                this.flipped = !this.flipped;
            }
        }
    }
}