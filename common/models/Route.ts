/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Route 
    extends Common.Models.FieldElement {

        public paper: Common.Interfaces.IPaper;
        public grid: Common.Interfaces.IGrid;
        public nodes: Common.Models.ModifiableLinkedList<Common.Models.RouteNode>;
        public field: Common.Interfaces.IField;
        public player: Common.Interfaces.IPlayer;
        public routePath: Common.Models.RoutePath; 
        public layer: Common.Models.Layer;
        public dragInitialized: boolean;
        public type: Common.Enums.RouteTypes;

        constructor(
            player: Common.Interfaces.IPlayer
        ) {
            super(player.field, player);

            this.player = player;
            if(this.player)
                this.nodes = new Common.Models.ModifiableLinkedList();
        }

        public abstract moveNodesByDelta(dx: number, dy: number);
        public abstract setContext(player: Common.Interfaces.IPlayer); 
        public abstract initializeCurve(coords: Common.Models.Coordinates, flip?: boolean);

        public fromJson(json: any): any { 
            this.guid = json.guid;
        }

        public toJson(): any {
            return {
                nodes: this.nodes.toJson(),
                guid: this.guid
            }
        }

        public remove(): void {
            this.routePath.remove();
            this.nodes.forEach(function(node, index) {
                node.data.clear();
            });
        }

        public draw() {
            if (!this.player) {
                throw new Error('Route player is not set');
            }
            this.routePath.pathString = this.getMixedStringFromNodes(this.nodes.toArray());
            this.routePath.draw();
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
        }

        public drawLine() {
            if (!this.player) {
                throw new Error('Route player is not set');
            }
            this.routePath.pathString = this.getPathStringFromNodes(true, this.nodes.toArray());
            this.routePath.draw();
        }

        
        public addNode(
            routeNode: Common.Interfaces.IRouteNode,
            render?: boolean
        ): Common.Models.LinkedListNode<Common.Models.RouteNode> {
            
            if (!this.nodes.hasElements() && Common.Enums.RouteNodeTypes.Root)
                throw new Error('Route addNode(): first route node must be of type Root');

            let node = new Common.Models.LinkedListNode(
            	routeNode,
            	null
            );
            this.nodes.add(node);
            this.layer.addLayer(routeNode.layer);

            if (render !== false) {
            	node.data.draw();
            	//this.player.set.push(node.data);
            	this.draw();
            }
            return node;
        }

        public getLastNode() {
            //return this.nodes.getLast<Common.Models.FieldElement>();
            return null;
        }

        public getMixedStringFromNodes(
            nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]
        ): string {
            if (!nodeArray || nodeArray.length == 0) {
                throw new Error('Cannot get mixed path string on empty node array');
            }
            // must always have at least 2 nodes
            if (nodeArray.length == 1) {
                return '';
            }
            let str = '';
            for (let i = 0; i < nodeArray.length; i++) {
                let node = nodeArray[i];
                if (!node.next) {
                    // just in case
                    break;
                }
                // must always have at least 2 nodes
                let type = node.data.type;
                let nextType = node.next.data.type;
                if (type == Common.Enums.RouteNodeTypes.CurveStart) {
                    if (nextType != Common.Enums.RouteNodeTypes.CurveControl) {
                        throw new Error('A curve start node must be followed by a curve control node');
                    }
                    // Good: next node is curve control
                    // check for 2 subsequent nodes
                    if (!node.next.next) {
                        throw new Error('a curve must have a control and end node');
                    }
                    let endType = node.next.next.data.type;
                    if (endType != Common.Enums.RouteNodeTypes.CurveEnd) {
                        throw new Error('A curve must end with a curve end node');
                    }
                    str += this.getCurveStringFromNodes(true, [
                        node.data,
                        node.next.data,
                        node.next.next.data // next (end)
                    ]);
                    i++;
                }
                else if (type == Common.Enums.RouteNodeTypes.CurveEnd) {
                    if (i == 0) {
                        throw new Error('curveEnd node cannot be the first node');
                    }
                    if (nextType == Common.Enums.RouteNodeTypes.CurveControl) {
                        // check for 2 subsequent nodes
                        if (!node.next.next) {
                            throw new Error('a curve must have a control and end node');
                        }
                        let endType = node.next.next.data.type;
                        if (endType != Common.Enums.RouteNodeTypes.CurveEnd) {
                            throw new Error('A curve must end with a curve end node');
                        }
                        str += this.getCurveStringFromNodes(false, [
                            node.data,
                            node.next.data,
                            node.next.next.data // next (end)
                        ]);
                        i++;
                    }
                    else {
                        // next node is normal node
                        str += this.getPathStringFromNodes(false, [
                            node.data,
                            node.next.data
                        ]);
                    }
                }
                else {
                    // assuming we are drawing a straight path
                    str += this.getPathStringFromNodes(i == 0, [
                        node.data,
                        node.next.data
                    ]);
                }
            }
            return str;
        }

        public getPathStringFromNodes(
            initialize: boolean, 
            nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]
        ) {
            return Common.Drawing.Utilities.getPathString(
                initialize, 
                this._prepareNodesForPath(nodeArray)
            );
        }

        public getCurveStringFromNodes(
            initialize: boolean, 
            nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]
        ): string {
            return Common.Drawing.Utilities.getCurveString(
                initialize,
                this._prepareNodesForPath(nodeArray)
            );
        }

        private _prepareNodesForPath(
            nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]
        ) {
            let coords = [];
            for (let i = 0; i < nodeArray.length; i++) {
                let node = nodeArray[i];
                coords.push(
                    node.data.graphics.location.ax,
                    node.data.graphics.location.ay
                );
            }
            return coords;
        }
    }
}