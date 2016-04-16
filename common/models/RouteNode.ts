/// <reference path='./models.ts' />

module Common.Models {

    export abstract class RouteNode 
    extends Common.Models.FieldElement {

        public node: Common.Models.LinkedListNode<Common.Interfaces.IRouteNode>;
        public type: Common.Enums.RouteNodeTypes;
        public routeAction: Common.Interfaces.IRouteAction;
        public routeControlPath: Common.Interfaces.IRouteControlPath;
        public player: Common.Interfaces.IPlayer;

        constructor(
            context: Common.Interfaces.IPlayer, 
            relativeCoordinates: Common.Models.RelativeCoordinates, 
            type: Common.Enums.RouteNodeTypes
        ) {
            super(context.field, context);

            this.player = context;

            let coords = relativeCoordinates.getCoordinates();
            this.layer.graphics.updateFromCoordinates(coords.x, coords.y);

            this.layer.graphics.dimensions.radius = this.grid.getSize() / 4;
            this.layer.graphics.dimensions.width = this.layer.graphics.dimensions.radius * 2;
            this.layer.graphics.dimensions.height = this.layer.graphics.dimensions.radius * 2;
            
            this.type = type;
            this.node = new Common.Models.LinkedListNode(this, null);            
            this.layer.type = Common.Enums.LayerTypes.RouteNode;
        }

        public draw() {
            this.layer.graphics.circle();
        }
        
        public setContext(context: Common.Interfaces.IPlayer) {
            this.player = context;
            this.field = context.field;
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
