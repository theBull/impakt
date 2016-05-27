/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class EditorRoute 
    extends Common.Models.Route
    implements Common.Interfaces.IRoute {

        constructor(dragInitialized?: boolean) {
            super(dragInitialized);
        }

        public setPlayer(player: Common.Interfaces.IPlayer): void {
            super.setPlayer(player);
            this.routePath = new Playbook.Models.EditorRoutePath();
            this.routePath.initialize(this.field, this);
            this.renderType = Common.Enums.RenderTypes.Editor;
        }

        public setContext(player: Common.Interfaces.IPlayer) {
            if (player) {
                this.player = player;
                this.grid = this.player.grid;
                this.field = this.player.field;
                this.paper = this.player.paper;
                let self = this;
                this.nodes.forEach(function (
                    node: Common.Interfaces.IRouteNode, index: number) {
                        node.setContext(self);
                        
                        if (!self.layer.containsLayer(node.layer)) {
                            self.layer.addLayer(node.layer);
                        }
                });
                this.draw();
            }
        }

        public addNode(
            routeNode: Common.Interfaces.IRouteNode,
            render?: boolean
        ): Common.Interfaces.IRouteNode {
            // Ensure there is a root node before attempting to add the given node
            if (this.nodes.isEmpty() && routeNode.type != Common.Enums.RouteNodeTypes.Root) {
                // add root node
                let rootNode = new Playbook.Models.EditorRouteNode(
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

        public initializeCurve(coords: Common.Models.Coordinates, flip?: boolean) {
            
            /**
             * TODO @theBull - add functionality for creating curves
             * in subsequent segments of the route
             */
            // pre-condition: we do not have < 1 nodes, since we
            // always create a node when we initialize the object.
            // TODO: if there are more than 3 nodes?
            if (this.nodes.size() == 0) {
                // ignore this command if assignment node list is empty
                // or if there are more than 3 nodes (TODO)
                return;
            }

            let lastNode, controlNode, endNode;

            if (this.nodes.hasElements() && this.nodes.size() == 1) {
                
                // last node is our start node
                lastNode = this.nodes.getLast();
                lastNode.type = Common.Enums.RouteNodeTypes.CurveStart;

                
                // add control node and end node. They share the
                // same relative coordinates as the root/last node to start
                
                controlNode = new Playbook.Models.EditorRouteNode(
                    new Common.Models.RelativeCoordinates(
                        lastNode.graphics.placement.relative.rx,
                        lastNode.graphics.placement.relative.ry,
                        this.player
                    ),
                    Common.Enums.RouteNodeTypes.CurveControl
                );
                controlNode.initialize(this.field, this.player);
                endNode = new Playbook.Models.EditorRouteNode(
                    new Common.Models.RelativeCoordinates(
                        lastNode.graphics.placement.relative.rx,
                        lastNode.graphics.placement.relative.ry,
                        this.player
                    ),
                    Common.Enums.RouteNodeTypes.CurveEnd
                );
                endNode.initialize(this.field, this.player);

                // false: do not render nodes
                this.addNode(controlNode, false);
                this.addNode(endNode, true);
            } else {
                lastNode = this.nodes.getRoot();
                controlNode = this.nodes.getIndex(1);
                endNode = this.nodes.getIndex(2);
            }

            if (flip === true) {
                controlNode.graphics.updateFromAbsolute(
                    coords.x,
                    lastNode.graphics.location.ay
                );
            }
            else {

                controlNode.graphics.updateFromAbsolute(
                    lastNode.graphics.location.ax,
                    coords.y
                );
            }

            endNode.graphics.updateFromAbsolute(coords.x, coords.y);

            this.drawCurve(controlNode);
        }

        public moveNodesByDelta(dx: number, dy: number) {
            this.nodes.forEach(function(node, index) {
                if (node ) {
                    node.moveByDelta(dx, dy);
                }
            });
        }
    }
}