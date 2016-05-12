/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class EditorRoute 
    extends Common.Models.Route
    implements Common.Interfaces.IRoute {

        constructor(
            player: Common.Interfaces.IPlayer, 
            dragInitialized?: boolean
        ) {
            super(player);

            this.type = Common.Enums.RouteTypes.Generic;
            this.dragInitialized = dragInitialized === true;

            this.routePath = new Playbook.Models.EditorRoutePath(this);

            if (this.player) {
                // add root node
                let rootNode = new Playbook.Models.EditorRouteNode(
                    this, 
                    new Common.Models.RelativeCoordinates(
                        0, 0, this.player
                    ),
                    Common.Enums.RouteNodeTypes.Root 
                );
                rootNode.layer.graphics.disable();
                this.addNode(rootNode, false);
            }

            this.layer.addLayer(this.routePath.layer);
            this.player.layer.addLayer(this.layer);
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

        public fromJson(json: any): any {
            super.fromJson(json);
            this.dragInitialized = json.dragInitialized;
            this.guid = json.guid;
            // initialize route nodes
            if (json.nodes) {
                for (let i = 0; i < json.nodes.length; i++) {
                    let rawNode = json.nodes[i];
                    let relativeCoordinates = new Common.Models.RelativeCoordinates(
                        rawNode.layer.graphics.placement.coordinates.x, 
                        rawNode.layer.graphics.placement.coordinates.y, 
                        this.player
                    );
                    let routeNodeModel = new Playbook.Models.EditorRouteNode(
                        this, 
                        relativeCoordinates, 
                        rawNode.type
                    );
                    routeNodeModel.fromJson(rawNode);
                    this.addNode(routeNodeModel, false);
                }
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
                    this,
                    new Common.Models.RelativeCoordinates(
                        lastNode.layer.graphics.placement.relative.rx,
                        lastNode.layer.graphics.placement.relative.ry,
                        this.player
                    ),
                    Common.Enums.RouteNodeTypes.CurveControl
                );
                endNode = new Playbook.Models.EditorRouteNode(
                    this,
                    new Common.Models.RelativeCoordinates(
                        lastNode.layer.graphics.placement.relative.rx,
                        lastNode.layer.graphics.placement.relative.ry,
                        this.player
                    ),
                    Common.Enums.RouteNodeTypes.CurveEnd
                );

                // false: do not render nodes
                this.addNode(controlNode, false);
                this.addNode(endNode, true);
            } else {
                lastNode = this.nodes.getRoot();
                controlNode = this.nodes.getIndex(1);
                endNode = this.nodes.getIndex(2);
            }

            if (flip === true) {
                controlNode.layer.graphics.updateLocation(
                    coords.x,
                    lastNode.layer.graphics.location.ay
                );
            }
            else {

                controlNode.layer.graphics.updateLocation(
                    lastNode.layer.graphics.location.ax,
                    coords.y
                );
            }

            endNode.layer.graphics.updateLocation(coords.x, coords.y);

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