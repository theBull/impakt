/// <reference path='./models.ts' />

module Playbook.Models {

    export class PreviewRoute 
    extends Common.Models.Route
    implements Common.Interfaces.IRoute {

        constructor(
            player: Common.Interfaces.IPlayer
        ) {
            super(player);

            this.dragInitialized = false; 
            this.type = Common.Enums.RouteTypes.Preview;
            this.layer.graphics.disable();

            if (this.player) {
                // add root node
                let rootNode = new Playbook.Models.PreviewRouteNode(
                    this.player,
                    new Common.Models.RelativeCoordinates(
                        0, 0, this.player
                    ),
                    Common.Enums.RouteNodeTypes.Root
                );
                this.addNode(rootNode, false);
            }

            this.routePath = new Playbook.Models.PreviewRoutePath(this);
            this.layer.type = Common.Enums.LayerTypes.PlayerRoute;
            this.layer.addLayer(this.routePath.layer);
        }

        public draw(): void {
            // route nodes not visible in preview
        }

        public setContext(player: Common.Interfaces.IPlayer): void {
            // TODO @theBull
        }

        public moveNodesByDelta(dx: number, dy: number) {
            // no movement available for preview route nodes
        }

        public initializeCurve(coords: Common.Models.Coordinates, flip?: boolean) {
            // initialize Curve not available for preview
        }

        public toJson(): any {
            let json = {};
            return $.extend(json, super.toJson());
        }

        public fromJson(json: any): any {
            super.fromJson(json);

            // initialize route nodes
            if (json.nodes) {
                for (let i = 0; i < json.nodes.length; i++) {
                    let rawNode = json.nodes[i];
                    let relativeCoordinates = new Common.Models.RelativeCoordinates(
                        rawNode.layer.graphics.placement.coordinates.x, 
                        rawNode.layer.graphics.placement.coordinates.y, 
                        this.player
                    );
                    let routeNodeModel = new Playbook.Models.PreviewRouteNode(
                        this.player, 
                        relativeCoordinates, 
                        rawNode.type
                    );
                    routeNodeModel.fromJson(rawNode);
                    this.addNode(routeNodeModel, false);
                }
            }
        }        
    }
}