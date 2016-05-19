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

            if (this.player) {
                // add root node
                let rootNode = new Playbook.Models.EditorRouteNode(
                    new Common.Models.RelativeCoordinates(
                        0, 0, this.player
                    ),
                    Common.Enums.RouteNodeTypes.Root
                );
                rootNode.initialize(this.field, this.player);
                rootNode.layer.toBack();
                rootNode.layer.hide();
                rootNode.disable();
                this.addNode(rootNode, false);
            }
            this.routePath = new Playbook.Models.EditorRoutePath();
            this.routePath.initialize(this.field, this.player);

            this.layer.addLayer(this.routePath.layer);
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
                controlNode.graphics.updateLocation(
                    coords.x,
                    lastNode.graphics.location.ay
                );
            }
            else {

                controlNode.graphics.updateLocation(
                    lastNode.graphics.location.ax,
                    coords.y
                );
            }

            endNode.graphics.updateLocation(coords.x, coords.y);

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