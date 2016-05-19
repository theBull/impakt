/// <reference path='./models.ts' />

module Common.Models {

    export abstract class RouteNode 
    extends Common.Models.FieldElement
    implements Common.Interfaces.IRouteNode,
    Common.Interfaces.ILinkedListNode<Common.Interfaces.IRouteNode> {

        public next: Common.Interfaces.IRouteNode;
        public prev: Common.Interfaces.IRouteNode;
        public type: Common.Enums.RouteNodeTypes;
        public routeAction: Common.Interfaces.IRouteAction;
        public routeControlPath: Common.Interfaces.IRouteControlPath;
        public route: Common.Interfaces.IRoute;
        public renderType: Common.Enums.RenderTypes;
        public relativeCoordinates: Common.Models.RelativeCoordinates;

        constructor(
            relativeCoordinates: Common.Models.RelativeCoordinates, 
            type: Common.Enums.RouteNodeTypes
        ) {
            super();
            if (Common.Utilities.isNullOrUndefined(relativeCoordinates))
                throw new Error('RouteNode constructor(): RelativeCoordinates is null or undefined');

            this.relativeCoordinates = relativeCoordinates; 
            this.type = type;
        }

        public initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void {
            super.initialize(field, this.relativeCoordinates.relativeElement);
            this.route = <Common.Interfaces.IRoute>route;
            this.graphics.updateFromRelative(this.relativeCoordinates.rx, this.relativeCoordinates.ry, this.relativeElement);
            this.graphics.dimensions.radius = this.grid.getSize() / 3.5;
            this.graphics.dimensions.width = this.graphics.dimensions.radius * 2;
            this.graphics.dimensions.height = this.graphics.dimensions.radius * 2;
            this.layer.type = Common.Enums.LayerTypes.PlayerRouteNode;
        }

        public draw() {
            this.graphics.circle();
        }
        
        // public setContext(route: Common.Interfaces.IRoute) {
        //     this.route = route;
        //     this.player = route.player;
        //     this.field = route.field;
        //     this.grid = this.context.grid;
        //     this.paper = this.context.paper;
        //     this.graphics.updateLocation();
        //     this.graphics.dimensions.radius = this.grid.getSize() / 4;
        //     this.graphics.dimensions.width = this.graphics.dimensions.radius * 2;
        //     this.graphics.dimensions.height = this.graphics.dimensions.radius * 2;
        //     this.draw();
        // }

        public fromJson(json: any) {
            if (!json)
                return;

            this.routeAction.fromJson(json.routeAction);
            this.contextmenuTemplateUrl = json.contextmenuTemplateUrl;
            this.type = json.type;
            this.renderType = json.renderType;
            this.relativeCoordinates.fromJson(json.relative);
        }

        public toJson() {
            return {
                relative: this.graphics.placement.relative.toJson(),
                type: this.type,
                routeAction: this.routeAction.toJson(),
                renderType: this.renderType,
                guid: this.guid
            }
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
