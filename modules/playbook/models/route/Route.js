/// <reference path='../models.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Route = (function (_super) {
            __extends(Route, _super);
            function Route(player, dragInitialized) {
                this.player = player;
                this.paper = this.player.paper;
                this.grid = this.paper.grid;
                _super.call(this, this);
                if (player) {
                    this.nodes = new Common.Models.ModifiableLinkedList();
                    // add root node
                    var root = this.addNode(this.player.placement.coordinates, Playbook.Models.RouteNodeType.Root, false);
                    root.data.disabled = true;
                }
                this.dragInitialized = dragInitialized === true;
                this.path = new Playbook.Models.FieldElement(this);
                this.color = 'black';
            }
            Route.prototype.setContext = function (player) {
                if (player) {
                    this.player = player;
                    this.grid = this.player.grid;
                    this.field = this.player.field;
                    this.paper = this.player.paper;
                    var self_1 = this;
                    this.nodes.forEach(function (node, index) {
                        node.data.setContext(self_1);
                        // Pushing this onto the fieldElementSet maintained
                        // by 'self.context', which is a Player. This fieldElementSet
                        // is a Raphael set, which allows bulk transformations.
                        if (!self_1.player.set.getByGuid(node.data.guid)) {
                            self_1.player.set.push(node.data);
                        }
                    });
                    this.draw();
                }
            };
            Route.prototype.fromJson = function (json) {
                this.dragInitialized = json.dragInitialized;
                this.guid = json.guid;
                // initialize route nodes
                if (json.nodes) {
                    for (var i = 0; i < json.nodes.length; i++) {
                        var rawNode = json.nodes[i];
                        var relativeCoordinates = new Playbook.Models.RelativeCoordinates(rawNode.placement.coordinates.x, rawNode.placement.coordinates.y, this.player);
                        var routeNodeModel = new Playbook.Models.RouteNode(this, relativeCoordinates, rawNode.type);
                        routeNodeModel.fromJson(rawNode);
                        this.addNode(routeNodeModel.getCoordinates(), routeNodeModel.type, false);
                    }
                }
            };
            Route.prototype.toJson = function () {
                return {
                    nodes: this.nodes.toJson(),
                    guid: this.guid,
                    dragInitialized: this.dragInitialized
                };
            };
            Route.prototype.erase = function () {
                this.paper.remove(this.path.raphael);
                this.nodes.forEach(function (node, index) {
                    node.data.erase();
                });
            };
            Route.prototype.draw = function () {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                var pathStr = this.getMixedStringFromNodes(this.nodes.toArray());
                console.log(pathStr);
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': this.color,
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.player.set.exclude(this.path);
                this.player.set.push(this.path);
            };
            Route.prototype.clear = function () {
                this.paper.remove(this.path.raphael);
                // this.nodes.forEach(function(node, index) {
                // 	if(node && node.data)
                // 		node.data.clear();
                // });
            };
            Route.prototype.drawCurve = function (node) {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                if (node) {
                }
                // update path
                var dataArray = this.nodes.toDataArray();
                var pathStr = this.paper.getCurveStringFromNodes(true, dataArray);
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': this.color,
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.player.set.exclude(this.path);
                this.player.set.push(this.path);
            };
            Route.prototype.drawLine = function () {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                var pathStr = this.paper.getPathStringFromNodes(true, this.nodes.toDataArray());
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': this.color,
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.player.set.exclude(this.path);
                this.player.set.push(this.path);
            };
            Route.prototype.initializeCurve = function (coords, flip) {
                // if(coords.x != this.player.x && coords.y != this.player.y) {
                // 	console.log('draw curve');
                // }
                // pre-condition: we do not have < 1 nodes, since we
                // always create a node when we initialize the object.
                // TODO: if there are more than 3 nodes?
                if (this.nodes.size() == 0 || this.nodes.size() > 3) {
                    // ignore this command if assignment node list is empty
                    // or if there are more than 3 nodes (TODO)
                    return;
                }
                var control, end;
                if (this.nodes.size() == 1) {
                    if (this.nodes.root && this.nodes.root.data) {
                        this.nodes.root.data.type = Playbook.Models.RouteNodeType.CurveStart;
                    }
                    else {
                        throw new Error('could not initialize curve; root is invalid');
                    }
                    // we only have a root node (start node);
                    // add control node and end node;
                    // initially, control and end nodes will
                    // share the same coords
                    control = this.addNode(new Playbook.Models.Coordinates(this.nodes.root.data.coordinates.x, this.nodes.root.data.coordinates.y), Playbook.Models.RouteNodeType.CurveControl, false); // false: do not render
                    end = this.addNode(this.grid.getCoordinatesFromAbsolute(coords.x, coords.y), Playbook.Models.RouteNodeType.CurveEnd, false); // false: do not render
                }
                if (!this.nodes || !this.nodes.root || !this.nodes.root.data)
                    throw new Error('failed to get control and end nodes');
                // get control and end nodes
                control = this.nodes.getIndex(1);
                console.log('root: ', flip, this.nodes.root.data, this.nodes.root.data.placement.coordinates.ax, this.nodes.root.data.placement.coordinates.ay);
                if (flip) {
                    control.data.placement.coordinates.ax = coords.x;
                    control.data.placement.coordinates.ay = this.nodes.root.data.placement.coordinates.ay;
                }
                else {
                    control.data.placement.coordinates.ax = this.nodes.root.data.placement.coordinates.ax;
                    control.data.placement.coordinates.ay = coords.y;
                }
                control.data.ox = control.data.placement.coordinates.ax;
                control.data.oy = control.data.placement.coordinates.ay;
                var controlGridCoords = this.grid.getCoordinatesFromAbsolute(control.data.placement.coordinates.ax, control.data.placement.coordinates.ay);
                control.data.placement.coordinates.x = controlGridCoords.x;
                control.data.placement.coordinates.y = controlGridCoords.y;
                if (control.data.raphael) {
                    control.data.raphael.attr({
                        cx: control.data.placement.coordinates.ax,
                        cy: control.data.placement.coordinates.ay
                    });
                }
                end = this.nodes.getIndex(2);
                end.data.placement.coordinates.ax = coords.x;
                end.data.placement.coordinates.ay = coords.y;
                end.data.placement.coordinates.ox = end.data.ax;
                end.data.placement.coordinates.oy = end.data.ay;
                var endGridCoords = this.grid.getCoordinatesFromAbsolute(end.data.placement.coordinates.ax, end.data.placement.coordinates.ay);
                end.data.placement.coordinates.x = endGridCoords.x;
                end.data.placement.coordinates.y = endGridCoords.y;
                if (end.data.raphael) {
                    end.data.raphael.attr({
                        cx: end.data.placement.coordinates.ax,
                        cy: end.data.placement.coordinates.ay
                    });
                }
                // control node follows y value of cursor
                // update control node
                //control.node.setCoordinate(new Playbook.Editor.Coordinate(0, coords.y));
                // end node follows x,y value of cursor
                // update end node
                this.drawCurve(control.data);
            };
            Route.prototype.addNode = function (coords, type, render) {
                throw new Error('Route addNode(): implement relative coordinates for route nodes');
                // let routeNodeType = type || (
                // 	this.nodes.hasElements() ? 
                // 	Playbook.Models.RouteNodeType.Normal : 
                // 	Playbook.Models.RouteNodeType.Root
                // );
                // let routeNode = new Playbook.Models.RouteNode(
                // 	this, null, routeNodeType
                // );
                // // let self = this;
                // // routeNode.onModified(function(data: any) {
                // // 	self.generateChecksum();
                // // });
                // let node = new Common.Models.LinkedListNode(
                // 	routeNode,
                // 	null
                // );
                // this.nodes.add(node);
                // this.player.set.push(node.data);
                // if (render !== false) {
                // 	node.data.draw();
                // 	//this.player.set.push(node.data);
                // 	this.draw();
                // }
                // return node;
            };
            Route.prototype.getLastNode = function () {
                //return this.nodes.getLast<Playbook.Models.FieldElement>();
                return null;
            };
            Route.prototype.getMixedStringFromNodes = function (nodeArray) {
                if (!nodeArray || nodeArray.length == 0) {
                    throw new Error('Cannot get mixed path string on empty node array');
                }
                // must always have at least 2 nodes
                if (nodeArray.length == 1) {
                    return '';
                }
                var str = '';
                for (var i = 0; i < nodeArray.length; i++) {
                    var node = nodeArray[i];
                    if (!node.next) {
                        // just in case
                        break;
                    }
                    // must always have at least 2 nodes
                    var type = node.data.type;
                    var nextType = node.next.data.type;
                    if (type == Playbook.Models.RouteNodeType.CurveStart) {
                        if (nextType != Playbook.Models.RouteNodeType.CurveControl) {
                            throw new Error('A curve start node must be followed by a curve control node');
                        }
                        // Good: next node is curve control
                        // check for 2 subsequent nodes
                        if (!node.next.next) {
                            throw new Error('a curve must have a control and end node');
                        }
                        var endType = node.next.next.data.type;
                        if (endType != Playbook.Models.RouteNodeType.CurveEnd) {
                            throw new Error('A curve must end with a curve end node');
                        }
                        str += this.paper.getCurveStringFromNodes(true, [
                            node.data,
                            node.next.data,
                            node.next.next.data // next (end)
                        ]);
                        i++;
                    }
                    else if (type == Playbook.Models.RouteNodeType.CurveEnd) {
                        if (i == 0) {
                            throw new Error('curveEnd node cannot be the first node');
                        }
                        if (nextType == Playbook.Models.RouteNodeType.CurveControl) {
                            // check for 2 subsequent nodes
                            if (!node.next.next) {
                                throw new Error('a curve must have a control and end node');
                            }
                            var endType = node.next.next.data.type;
                            if (endType != Playbook.Models.RouteNodeType.CurveEnd) {
                                throw new Error('A curve must end with a curve end node');
                            }
                            str += this.paper.getCurveStringFromNodes(false, [
                                node.data,
                                node.next.data,
                                node.next.next.data // next (end)
                            ]);
                            i++;
                        }
                        else {
                            // next node is normal node
                            str += this.paper.getPathStringFromNodes(false, [
                                node.data,
                                node.next.data
                            ]);
                        }
                    }
                    else {
                        // assuming we are drawing a straight path
                        str += this.paper.getPathStringFromNodes(i == 0, [
                            node.data,
                            node.next.data
                        ]);
                    }
                }
                return str;
            };
            Route.prototype.moveNodesByDelta = function (dx, dy) {
                this.nodes.forEach(function (node, index) {
                    if (node && node.data) {
                        node.data.moveByDelta(dx, dy);
                    }
                });
            };
            return Route;
        })(Common.Models.Modifiable);
        Models.Route = Route;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
var Playbook;
(function (Playbook) {
    var Editor;
    (function (Editor) {
        (function (RouteTypes) {
            RouteTypes[RouteTypes["None"] = 0] = "None";
            RouteTypes[RouteTypes["Block"] = 1] = "Block";
            RouteTypes[RouteTypes["Scan"] = 2] = "Scan";
            RouteTypes[RouteTypes["Run"] = 3] = "Run";
            RouteTypes[RouteTypes["Route"] = 4] = "Route";
            RouteTypes[RouteTypes["Cover"] = 5] = "Cover";
            RouteTypes[RouteTypes["Zone"] = 6] = "Zone";
            RouteTypes[RouteTypes["Spy"] = 7] = "Spy";
            RouteTypes[RouteTypes["Option"] = 8] = "Option";
            RouteTypes[RouteTypes["HandOff"] = 9] = "HandOff";
            RouteTypes[RouteTypes["Pitch"] = 10] = "Pitch";
        })(Editor.RouteTypes || (Editor.RouteTypes = {}));
        var RouteTypes = Editor.RouteTypes;
    })(Editor = Playbook.Editor || (Playbook.Editor = {}));
})(Playbook || (Playbook = {}));
