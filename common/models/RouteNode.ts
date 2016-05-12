/// <reference path='./models.ts' />

module Common.Models {

    export abstract class RouteNode 
    extends Common.Models.FieldElement
    implements Common.Interfaces.IRouteNode,
    Common.Interfaces.ILinkedListNode<Common.Interfaces.IRouteNode> {

        public route: Common.Interfaces.IRoute;
        public next: Common.Interfaces.IRouteNode;
        public prev: Common.Interfaces.IRouteNode;
        public type: Common.Enums.RouteNodeTypes;
        public routeAction: Common.Interfaces.IRouteAction;
        public routeControlPath: Common.Interfaces.IRouteControlPath;
        public player: Common.Interfaces.IPlayer;

        constructor(
            route: Common.Interfaces.IRoute, 
            relativeCoordinates: Common.Models.RelativeCoordinates, 
            type: Common.Enums.RouteNodeTypes
        ) {
            super(route.field, route.player);

            this.route = route;
            this.player = route.player;

            this.layer.graphics.updateFromRelative(relativeCoordinates.rx, relativeCoordinates.ry, this.player);
            this.layer.graphics.dimensions.radius = this.grid.getSize() / 3.5;
            this.layer.graphics.dimensions.width = this.layer.graphics.dimensions.radius * 2;
            this.layer.graphics.dimensions.height = this.layer.graphics.dimensions.radius * 2;
            
            this.type = type;

            /**
             * Add layer to route layers
             * @type {[type]}
             */
            this.layer.type = Common.Enums.LayerTypes.PlayerRouteNode;
        }

        public draw() {
            this.layer.graphics.circle();
        }
        
        public setContext(route: Common.Interfaces.IRoute) {
            this.route = route;
            this.player = route.player;
            this.field = route.field;
            this.grid = this.context.grid;
            this.paper = this.context.paper;
            this.layer.graphics.updateLocation();
            this.layer.graphics.dimensions.radius = this.grid.getSize() / 4;
            this.layer.graphics.dimensions.width = this.layer.graphics.dimensions.radius * 2;
            this.layer.graphics.dimensions.height = this.layer.graphics.dimensions.radius * 2;
            this.draw();
        }

        public fromJson(json: any) {
            if (!json)
                return;

            this.routeAction.fromJson(json.routeAction);
            this.contextmenuTemplateUrl = json.contextmenuTemplateUrl;
            this.guid = json.guid;
            this.type = json.type;
            this.layer.graphics.fromJson(json.graphics);
            // route node has been modified
            this.setModified();
        }

        public toJson() {
            var inherited = super.toJson();
            var self = {
                type: this.type,
                routeAction: this.routeAction.toJson(),
                graphics: this.layer.graphics.toJson()
            }
            return $.extend(inherited, self);
        }

        public isCurveNode() {
            return this.type == Common.Enums.RouteNodeTypes.CurveControl ||
                this.type == Common.Enums.RouteNodeTypes.CurveEnd ||
                this.type == Common.Enums.RouteNodeTypes.CurveStart;
        }

        public setAction(action: Common.Enums.RouteNodeActions) {
            this.routeAction.action = action;
            this.routeAction.draw();
            
            // route node has been modified
            this.setModified();
        }
    }
}
