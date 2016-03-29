/// <reference path='../models.ts' />
/// <reference path='../field/FieldElement.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        (function (RouteNodeType) {
            RouteNodeType[RouteNodeType["None"] = 0] = "None";
            RouteNodeType[RouteNodeType["Normal"] = 1] = "Normal";
            RouteNodeType[RouteNodeType["Root"] = 2] = "Root";
            RouteNodeType[RouteNodeType["CurveStart"] = 3] = "CurveStart";
            RouteNodeType[RouteNodeType["CurveControl"] = 4] = "CurveControl";
            RouteNodeType[RouteNodeType["CurveEnd"] = 5] = "CurveEnd";
            RouteNodeType[RouteNodeType["End"] = 6] = "End";
        })(Models.RouteNodeType || (Models.RouteNodeType = {}));
        var RouteNodeType = Models.RouteNodeType;
        // Maintains a list of actions that can be taken
        // at each route node
        (function (RouteNodeActions) {
            RouteNodeActions[RouteNodeActions["None"] = 0] = "None";
            RouteNodeActions[RouteNodeActions["Block"] = 1] = "Block";
            RouteNodeActions[RouteNodeActions["Delay"] = 2] = "Delay";
            RouteNodeActions[RouteNodeActions["Continue"] = 3] = "Continue";
            RouteNodeActions[RouteNodeActions["Juke"] = 4] = "Juke";
            RouteNodeActions[RouteNodeActions["ZigZag"] = 5] = "ZigZag";
        })(Models.RouteNodeActions || (Models.RouteNodeActions = {}));
        var RouteNodeActions = Models.RouteNodeActions;
        var RouteNode = (function (_super) {
            __extends(RouteNode, _super);
            function RouteNode(context, relativeCoordinates, type) {
                _super.call(this, context);
                if (relativeCoordinates) {
                    this.placement = new Playbook.Models.Placement(relativeCoordinates.rx, relativeCoordinates.ry, context.player);
                    if (this.grid) {
                        this.radius = this.grid.getSize() / 4;
                        this.width = this.radius * 2;
                        this.height = this.radius * 2;
                    }
                }
                // set by default to false if not explicitly set already
                if (this.disabled == undefined || this.disabled == null)
                    this.disabled = false;
                if (this.selected == undefined || this.selected == null)
                    this.selected = false;
                this.node = new Common.Models.LinkedListNode(this, null);
                this.type = type;
                this.action = Playbook.Models.RouteNodeActions.None;
                this.actionable = !(this.type == Playbook.Models.RouteNodeType.CurveControl);
                this.actionGraphic = new Playbook.Models.FieldElement(this);
                this.opacity = 0;
                // temporary
                this.controlPath = new Playbook.Models.FieldElement(this);
                // TODO
                this.contextmenuTemplateUrl = 'modules/playbook/contextmenus/routeNode/playbook-contextmenus-routeNode.tpl.html';
            }
            RouteNode.prototype.setContext = function (context) {
                this.context = context;
                this.field = this.context.field;
                this.grid = this.context.grid;
                this.paper = this.context.paper;
                this.placement.refresh();
                this.radius = this.grid.getSize() / 4;
                this.width = this.radius * 2;
                this.height = this.radius * 2;
                this.draw();
            };
            RouteNode.prototype.fromJson = function (json) {
                this.action = json.action;
                this.actionable = json.actionable;
                this.contextmenuTemplateUrl = json.contextmenuTemplateUrl;
                this.controlList = json.controlList;
                this.disabled = json.disabled;
                this.guid = json.guid;
                this.height = json.height;
                this.opacity = json.opacity;
                this.radius = json.radius;
                this.selected = json.selected;
                this.type = json.type;
                this.width = json.width;
                this.placement.fromJson(json.placement);
                // route node has been modified
                this.setModified();
            };
            RouteNode.prototype.toJson = function () {
                var inherited = _super.prototype.toJson.call(this);
                var self = {
                    type: this.type,
                    action: this.action,
                    disabled: this.disabled,
                    selected: this.selected,
                    controlList: null,
                    actionable: this.actionable,
                    opacity: this.opacity
                };
                return $.extend(inherited, self);
            };
            RouteNode.prototype.getCoordinates = function () {
                return new Playbook.Models.Coordinates(this.placement.coordinates.x, this.placement.coordinates.y);
            };
            RouteNode.prototype.erase = function () {
                this.paper.remove(this.raphael);
                this.paper.remove(this.actionGraphic.raphael);
            };
            RouteNode.prototype.draw = function () {
                console.log('draw node');
                this.clear();
                this.raphael = this.paper.circle(this.placement.coordinates.x, this.placement.coordinates.y, this.radius).attr({
                    'fill': 'grey',
                    'opacity': this.opacity
                });
                this.raphael.node.setAttribute('class', 'grab');
                _super.prototype.click.call(this, this.click, this);
                this.drag(this.dragMove, this.dragStart, this.dragEnd, this, // drag move context
                this, // drag start context
                this // drag end context
                );
                this.hover(this.hoverIn, this.hoverOut, this);
                this.contextmenu(this.contextmenuHandler, this);
                if (this.type == Playbook.Models.RouteNodeType.CurveControl) {
                }
            };
            RouteNode.prototype.clear = function () {
                this.paper.remove(this.raphael);
            };
            RouteNode.prototype.drawAction = function () {
                console.log('drawing action');
                switch (this.action) {
                    case Playbook.Models.RouteNodeActions.None:
                        console.log('removing node action graphic');
                        this.paper.remove(this.actionGraphic.raphael);
                        this.actionGraphic.raphael = null;
                        break;
                    case Playbook.Models.RouteNodeActions.Block:
                        console.log('drawing block action');
                        this.paper.remove(this.actionGraphic.raphael);
                        var theta = this.paper.theta(this.node.prev.data.placement.coordinates.ax, this.node.prev.data.placement.coordinates.ay, this.placement.coordinates.ax, this.placement.coordinates.ay);
                        var thetaDegrees = this.paper.toDegrees(theta);
                        console.log('theta: ', theta, thetaDegrees);
                        this.actionGraphic.placement.coordinates.x = this.placement.coordinates.x - 0.5;
                        this.actionGraphic.placement.coordinates.y = this.placement.coordinates.y;
                        this.actionGraphic.width = this.width * 2;
                        this.actionGraphic.height = this.height * 2;
                        this.actionGraphic.placement.coordinates.ax = this.placement.coordinates.ax - this.width;
                        this.actionGraphic.placement.coordinates.ay = this.placement.coordinates.ay;
                        var pathStr = this.paper.getPathString(true, [
                            this.actionGraphic.placement.coordinates.ax,
                            this.actionGraphic.placement.coordinates.ay,
                            this.actionGraphic.placement.coordinates.ax + (this.width * 2),
                            this.actionGraphic.placement.coordinates.ay
                        ]);
                        this.actionGraphic.raphael = this.paper.path(pathStr).attr({
                            'stroke': 'blue',
                            'stroke-width': 2
                        });
                        this.actionGraphic.raphael.node.setAttribute('class', 'painted-fill');
                        this.actionGraphic.raphael.rotate((90 - thetaDegrees));
                        break;
                    case Playbook.Models.RouteNodeActions.Delay:
                        console.log('drawing block action');
                        this.paper.remove(this.actionGraphic.raphael);
                        this.actionGraphic.placement.coordinates.x = this.placement.coordinates.x - 0.5;
                        this.actionGraphic.placement.coordinates.y = this.placement.coordinates.y - 0.5;
                        this.actionGraphic.width = this.width * 2;
                        this.actionGraphic.height = this.height * 2;
                        this.actionGraphic.raphael = this.paper.rect(this.actionGraphic.placement.coordinates.x, this.actionGraphic.placement.coordinates.y, this.actionGraphic.width, this.actionGraphic.height).attr({
                            'stroke': 'orange',
                            'stroke-width': 1
                        });
                        this.actionGraphic.raphael.node.setAttribute('class', 'painted-fill');
                        break;
                }
            };
            RouteNode.prototype.contextmenuHandler = function (e, self) {
                console.log('route node contextmenu');
                self.paper.canvas.invoke(Playbook.Editor.CanvasActions.RouteNodeContextmenu, 'open route node context menu...', self);
            };
            RouteNode.prototype.hoverIn = function (e, self) {
                if (!this.disabled && !this.selected) {
                    self.toggleOpacity();
                    self.raphael.attr({
                        'opacity': self.opacity
                    });
                }
            };
            RouteNode.prototype.hoverOut = function (e, self) {
                if (!this.disabled && !this.selected) {
                    self.toggleOpacity();
                    self.raphael.attr({
                        'opacity': self.opacity
                    });
                }
            };
            RouteNode.prototype.drawControlPaths = function () {
                var start, control, end;
                if (this.type == Playbook.Models.RouteNodeType.CurveControl) {
                    if (!this.node.next || !this.node.prev) {
                        console.log('control does not have next and prev nodes');
                        return null;
                    }
                    start = this.node.prev.data;
                    control = this;
                    end = this.node.next.data;
                }
                else if (this.type == Playbook.Models.RouteNodeType.CurveEnd) {
                    if (!this.node.prev || !this.node.prev.prev) {
                        console.log(['end node does not have previous control or previous',
                            'curve start nodes'].join(''));
                        return null;
                    }
                    start = this.node.prev.prev.data;
                    control = this.node.prev.data;
                    end = this;
                }
                else if (this.type == Playbook.Models.RouteNodeType.CurveStart) {
                    if (!this.node.next || !this.node.next.next) {
                        console.log(['curve start node does not have subsequent',
                            'control and end nodes'].join(''));
                        return null;
                    }
                    start = this;
                    control = this.node.next.data;
                    end = this.node.next.next.data;
                }
                var pathStr = this.paper.getPathStringFromNodes(true, [start, control, end]);
                console.log(pathStr);
                start.paper.remove(start.controlPath.raphael);
                start.controlPath.raphael = start.paper.path(pathStr).attr({
                    'stroke': 'grey',
                    'stroke-width': 1,
                    'opacity': 0.2
                });
                // this is referring to the player.
                this.player.set.exclude(start.controlPath);
                this.player.set.push(start.controlPath);
            };
            RouteNode.prototype.click = function (e, self) {
                console.log('route node:', self);
                self.select();
                self.toggleOpacity();
                self.raphael.attr({ 'opacity': self.opacity });
            };
            RouteNode.prototype.dragMove = function (dx, dy, posx, posy, e) {
                if (this.disabled) {
                    return;
                }
                // (snapping) only adjust the positioning of the player
                // for every grid-unit worth of movement
                var snapDx = this.grid.snapPixel(dx);
                var snapDy = this.grid.snapPixel(dy);
                this.moveByDelta(snapDx, snapDy);
                var gridCoords = this.grid.getCoordinatesFromAbsolute(this.placement.coordinates.ax, this.placement.coordinates.ay);
                this.placement.coordinates.x = gridCoords.x;
                this.placement.coordinates.y = gridCoords.y;
                this.raphael.transform([
                    't', this.placement.coordinates.dx, ', ',
                    this.placement.coordinates.dy
                ].join(''));
                if (this.actionGraphic.raphael) {
                    this.actionGraphic.placement.coordinates.dx = snapDx - 0.5;
                    this.actionGraphic.placement.coordinates.dy = snapDy - 0.5;
                    this.actionGraphic.placement.coordinates.ax = this.placement.coordinates.ox + this.placement.coordinates.dx - 0.5;
                    this.actionGraphic.placement.coordinates.ay = this.placement.coordinates.oy + this.placement.coordinates.dy - 0.5;
                    this.actionGraphic.placement.coordinates.x = gridCoords.x - 0.5;
                    this.actionGraphic.placement.coordinates.y = gridCoords.y - 0.5;
                    this.actionGraphic.raphael.transform([
                        't', this.actionGraphic.placement.coordinates.dx, ', ',
                        this.actionGraphic.placement.coordinates.dy
                    ].join(''));
                    var theta = this.paper.theta(this.node.prev.data.placement.coordinates.ax, this.node.prev.data.placement.coordinates.ay, this.placement.coordinates.ax, this.placement.coordinates.ay);
                    var thetaDegrees = this.paper.toDegrees(theta);
                    console.log('rotating action', theta, thetaDegrees);
                    this.actionGraphic.raphael.rotate((90 - thetaDegrees));
                }
                // redraw the path
                if (this.isCurveNode()) {
                    console.log('dragging control:', this.type);
                }
                this.context.draw();
            };
            RouteNode.prototype.dragStart = function (x, y, e) {
                console.log('dragStart() not implemented');
            };
            RouteNode.prototype.dragEnd = function (e) {
                this.raphael.transform(['t', 0, ', ', 0].join(''));
                this.placement.coordinates.ox = this.placement.coordinates.ax;
                this.placement.coordinates.oy = this.placement.coordinates.ay;
                this.placement.coordinates.dx = 0;
                this.placement.coordinates.dy = 0;
                this.raphael.attr({
                    cx: this.placement.coordinates.ax,
                    cy: this.placement.coordinates.ay
                });
                if (this.actionGraphic.raphael) {
                    this.actionGraphic.raphael.transform(['t', 0, ', ', 0].join(''));
                    this.actionGraphic.placement.coordinates.ox = this.actionGraphic.placement.coordinates.ax;
                    this.actionGraphic.placement.coordinates.oy = this.actionGraphic.placement.coordinates.ay;
                    this.actionGraphic.placement.coordinates.dx = 0;
                    this.actionGraphic.placement.coordinates.dy = 0;
                    // this.actionGraphic.raphael.attr({
                    // 	x: this.actionGraphic.ax - (this.actionGraphic.width / 2),
                    // 	y: this.actionGraphic.ay - (this.actionGraphic.height / 2)
                    // });
                    this.drawAction();
                }
                // route node has been modified
                this.setModified();
            };
            RouteNode.prototype.moveByDelta = function (dx, dy) {
                this.placement.moveByDelta(dx, dy);
                // route node has been modified
                this.setModified();
            };
            RouteNode.prototype.isCurveNode = function () {
                return this.type == Playbook.Models.RouteNodeType.CurveControl ||
                    this.type == Playbook.Models.RouteNodeType.CurveEnd ||
                    this.type == Playbook.Models.RouteNodeType.CurveStart;
            };
            RouteNode.prototype.setAction = function (action) {
                this.action = action;
                console.log('updating action', this.action);
                this.drawAction();
                // route node has been modified
                this.setModified();
            };
            RouteNode.prototype.toggleSelect = function () {
                this.selected = !this.selected;
            };
            RouteNode.prototype.select = function () {
                this.selected = true;
            };
            RouteNode.prototype.deselect = function () {
                this.selected = false;
            };
            RouteNode.prototype.toggleOpacity = function () {
                this.opacity = this.opacity == 1 ? 0 : 1;
            };
            return RouteNode;
        })(Playbook.Models.FieldElement);
        Models.RouteNode = RouteNode;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
