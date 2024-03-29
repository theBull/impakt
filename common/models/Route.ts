/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Route 
    extends Common.Models.FieldElement {

        public canvas: Common.Interfaces.ICanvas;
        public grid: Common.Interfaces.IGrid;
        public nodes: Common.Models.LinkedList<Common.Interfaces.IRouteNode>;
        public field: Common.Interfaces.IField;
        public player: Common.Interfaces.IPlayer;
        public routePath: Common.Interfaces.IRoutePath; 
        public layer: Common.Models.Layer;
        public dragInitialized: boolean;
        public type: Common.Enums.RouteTypes;
        public renderType: Common.Enums.RenderTypes;
        public unitType: Team.Enums.UnitTypes;

        constructor(dragInitialized?: boolean) {
            super();
            this.dragInitialized = dragInitialized === true;
            this.type = Common.Enums.RouteTypes.Generic;
            this.flippable = true;
            this.unitType = Team.Enums.UnitTypes.Other;
        }

        public abstract moveNodesByDelta(dx: number, dy: number);
        public abstract setContext(player: Common.Interfaces.IPlayer); 
        public abstract initializeCurve(coords: Common.Models.Coordinates, flip?: boolean);

        public toJson(): any {
            return {
                nodes: this.nodes.toJson(),
                type: this.type,
                guid: this.guid,
                unitType: this.unitType
            };
        }

        public fromJson(json: any): any {
            if (Common.Utilities.isNullOrUndefined(this.player))
                throw new Error('Route fromJson(): setPlayer() must be called before serializing from json');
            
            this.guid = json.guid;
            this.type = json.type;
            this.unitType = json.unitType;
            
            // initialize route nodes
            if (json.nodes) {
                
                // Don't listen to changes while initializing the nodes list
                // (performance issue)
                this.nodes.listen(false);

                for (let i = 0; i < json.nodes.length; i++) {
                    let rawNode = json.nodes[i];

                    let relativeCoords = new Common.Models.RelativeCoordinates(0, 0, this.player);
                    if(Common.Utilities.isNotNullOrUndefined(rawNode.relative)) {
                        relativeCoords.fromJson(rawNode.relative);
                    }
                    
                    let routeNode = null;
                    switch(rawNode.renderType) {
                        case Common.Enums.RenderTypes.Preview:
                            routeNode = new Playbook.Models.PreviewRouteNode(relativeCoords, rawNode.type);
                            break;
                        case Common.Enums.RenderTypes.Editor:
                            routeNode = new Playbook.Models.EditorRouteNode(relativeCoords, rawNode.type);
                            break;
                    }


                    routeNode.initialize(this.field, this);
                    routeNode.fromJson(rawNode);

                    // shitty temp fix
                    if(i==0) {
                        routeNode.layer.toBack();
                        routeNode.disable();
                    }

                    this.addNode(routeNode, false);
                    
                }

                // start listening for changes in the nodes list again
                // (performance issue)
                this.nodes.listen(true);
            }
        }

        public setPlayer(player: Common.Interfaces.IPlayer): void {
            this.player = player;
            this.unitType = this.player.unitType;
            this.initialize(this.player.field, this.player);
            this.graphics.initializePlacement(this.player.graphics.placement);

            if (this.player) {
                this.nodes = new Common.Models.LinkedList<Common.Interfaces.IRouteNode>();

                let self = this;
                this.nodes.onModified(function() {
                    self.setModified(true);
                });
            }

            /**
             * Add layer to Player layers
             * @type {[type]}
             */
            this.layer.type = Common.Enums.LayerTypes.PlayerRoute;

            if(Common.Utilities.isNotNullOrUndefined(this.player) &&
                Common.Utilities.isNotNullOrUndefined(this.player.assignment)) {
                this.player.assignment.layer.addLayer(this.layer);
            }
        }

        public setPlacement(placement: Common.Models.Placement): void {
            this.nodes.forEach(function(node: Common.Interfaces.IRouteNode, index: number) {
                node.setPlacement(placement);
            });
        }

        public refresh(): void {
            this.nodes.forEach(function(node: Common.Interfaces.IRouteNode, index: number) {
                node.refresh();
            });
        }

        public remove(): void {
            this.routePath.remove();
            this.nodes.forEach(function(node: Common.Interfaces.IRouteNode, index: number) {
                node.layer.remove();
            });
        }

        public draw() {
            if (!this.player) {
                throw new Error('Route player is not set');
            }
            this.routePath.pathString = this.getMixedStringFromNodes(this.nodes.toArray());
            this.routePath.draw();

            // ensure the route nodes are above the route path
            this.bringNodesToFront();

            this.player.assignment.updateRouteArray();
        }

        public drawCurve(node: Common.Models.RouteNode) {
            if (!this.player) {
                throw new Error('Route player is not set');
            }
            if (node) {
            }
            // update path
            this.routePath.pathString = this.getCurveStringFromNodes(true, this.nodes.toArray());
            this.routePath.draw();

            // ensure the route nodes are above the route path
            this.bringNodesToFront();
        }

        public drawLine() {
            if (!this.player) {
                throw new Error('Route player is not set');
            }
            this.routePath.pathString = this.getPathStringFromNodes(true, this.nodes.toArray());
            this.routePath.draw();

            // ensure the route nodes are above the route path
            this.bringNodesToFront();
        }

        public bringNodesToFront(): void {
            this.nodes.forEach(function(routeNode: Common.Interfaces.IRouteNode) {
                routeNode.layer.toFront();
            });

            // move the route back so it's behind the player
            this.player.layer.toFront();

            // Fack! just do what I SAY!!!
            this.routePath.layer.toBack();
        }
        
        public addNode(
            routeNode: Common.Interfaces.IRouteNode,
            render?: boolean
        ): Common.Interfaces.IRouteNode {
            
            if (this.nodes.isEmpty() && (routeNode.type != Common.Enums.RouteNodeTypes.Root &&
                routeNode.type != Common.Enums.RouteNodeTypes.CurveStart)) {
                throw new Error('Route addNode(): first route node must be of type Root or CurveStart');
            }                

            this.nodes.add(routeNode);
            routeNode.draw();

            if (routeNode.type == Common.Enums.RouteNodeTypes.Root)
                this.disableRootNode(routeNode);

            this.draw();
            
            return routeNode;
        }

        public disableRootNode(routeNode: Common.Interfaces.IRouteNode): void {
            // ...then update its graphical info
            routeNode.layer.toBack();
            routeNode.layer.hide();
            routeNode.disable();
        }

        public getLastNode() {
            //return this.nodes.getLast<Common.Models.FieldElement>();
            return null;
        }

        public flip(): void {
            this.nodes.forEach(function(routeNode: Common.Interfaces.IRouteNode) {
                routeNode.flip();
            });
            this.flipped = !this.flipped;
            this.draw();
        }

        public getMixedStringFromNodes(
            nodeArray: Common.Interfaces.IRouteNode[]
        ): string {
            if (!nodeArray || nodeArray.length <= 1) {
                return '';
            }

            let str = '';
            for (let i = 0; i < nodeArray.length; i++) {
                let routeNode = nodeArray[i];
                if (Common.Utilities.isNullOrUndefined(routeNode))
                    continue;

                if (!routeNode.next) {
                    // just in case
                    break;
                }
                // must always have at least 2 nodes
                let type = routeNode.type;
                let nextType = routeNode.next.type;

                if (type == Common.Enums.RouteNodeTypes.CurveStart) {
                    if (nextType != Common.Enums.RouteNodeTypes.CurveControl) {
                        throw new Error('A curve start node must be followed by a curve control node');
                    }
                    // Good: next node is curve control
                    // check for 2 subsequent nodes
                    if (!routeNode.next.next) {
                        throw new Error('a curve must have a control and end node');
                    }
                    let endType = routeNode.next.next.type;
                    if (endType != Common.Enums.RouteNodeTypes.CurveEnd) {
                        throw new Error('A curve must end with a curve end node');
                    }
                    str += this.getCurveStringFromNodes(true, [
                        routeNode,
                        routeNode.next,
                        routeNode.next.next // next (end)
                    ]);
                    i++;
                }
                else if (type == Common.Enums.RouteNodeTypes.CurveEnd) {
                    if (i == 0) {
                        throw new Error('curveEnd node cannot be the first node');
                    }
                    if (nextType == Common.Enums.RouteNodeTypes.CurveControl) {
                        // check for 2 subsequent nodes
                        if (!routeNode.next.next) {
                            throw new Error('a curve must have a control and end node');
                        }
                        let endType = routeNode.next.next.type;
                        if (endType != Common.Enums.RouteNodeTypes.CurveEnd) {
                            throw new Error('A curve must end with a curve end node');
                        }
                        str += this.getCurveStringFromNodes(false, [
                            routeNode,
                            routeNode.next,
                            routeNode.next.next // next (end)
                        ]);
                        i++;
                    }
                    else {
                        // next node is normal node
                        str += this.getPathStringFromNodes(false, [
                            routeNode,
                            routeNode.next
                        ]);
                    }
                }
                else {
                    // assuming we are drawing a straight path
                    str += this.getPathStringFromNodes(i == 0, [
                        routeNode,
                        routeNode.next
                    ]);
                }
            }
            return str;
        }

        public getPathStringFromNodes(
            initialize: boolean, 
            nodeArray: Common.Interfaces.IRouteNode[]
        ) {
            return Common.Drawing.Utilities.getPathString(
                initialize, 
                this._prepareNodesForPath(nodeArray)
            );
        }

        public getCurveStringFromNodes(
            initialize: boolean, 
            nodeArray: Common.Interfaces.IRouteNode[]
        ): string {
            return Common.Drawing.Utilities.getCurveString(
                initialize,
                this._prepareNodesForPath(nodeArray)
            );
        }

        private _prepareNodesForPath(
            nodeArray: Common.Interfaces.IRouteNode[]
        ) {
            let coords = [];
            for (let i = 0; i < nodeArray.length; i++) {
                let routeNode = nodeArray[i];
                if (Common.Utilities.isNullOrUndefined(routeNode))
                    continue;

                coords.push(
                    routeNode.graphics.location.ax,
                    routeNode.graphics.location.ay
                );
            }
            return coords;
        }
    }
}