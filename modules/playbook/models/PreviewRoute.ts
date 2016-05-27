/// <reference path='./models.ts' />

module Playbook.Models {

    export class PreviewRoute 
    extends Common.Models.Route
    implements Common.Interfaces.IRoute {

        constructor() {
            super();
        }

        public setPlayer(player: Common.Interfaces.IPlayer): void {
            super.setPlayer(player);

            if (this.player) {
                // // add root node
                // let rootNode = new Playbook.Models.PreviewRouteNode(
                //     new Common.Models.RelativeCoordinates(
                //         0, 0, this.player
                //     ),
                //     Common.Enums.RouteNodeTypes.Root
                // );
                // rootNode.initialize(this.field, this.player);
                // this.addNode(rootNode, false);
            }
            this.routePath = new Playbook.Models.PreviewRoutePath();
            this.routePath.initialize(this.field, this);
            this.graphics.disable();
            this.renderType = Common.Enums.RenderTypes.Preview;
        }

        public addNode(
            routeNode: Common.Interfaces.IRouteNode,
            render?: boolean
        ): Common.Interfaces.IRouteNode {
            // Ensure there is a root node before attempting to add the given node
            if (this.nodes.isEmpty() && routeNode.type != Common.Enums.RouteNodeTypes.Root) {
                // add root node
                let rootNode = new Playbook.Models.PreviewRouteNode(
                    new Common.Models.RelativeCoordinates(
                        0, 0, this.player
                    ),
                    Common.Enums.RouteNodeTypes.Root
                );
                rootNode.initialize(this.field, this.player);
                
                // add first, since this step includes drawing the node
                super.addNode(rootNode, false);

                this.disableRootNode(rootNode);
            }
            return super.addNode(routeNode, false);
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
    }
}