/// <reference path='../models.ts' />
/// <reference path='../field/FieldElement.ts' />

module Playbook.Models {

    export enum RouteNodeType {    
        None,
        Normal,
        Root,
        CurveStart,
        CurveControl,
        CurveEnd,
        End
    }

    export enum RouteNodeActions {
        None,
        Block,
        Delay,
        Continue,
        Juke,
        ZigZag
    }

    export class RouteNode 
    extends Playbook.Models.FieldElement {

        public node: Common.Models.LinkedListNode<Playbook.Models.RouteNode>;
        public type: Playbook.Models.RouteNodeType;
        public action: Playbook.Models.RouteNodeActions;
        public actionable: boolean;
        public actionGraphic: Playbook.Models.FieldElement;
        public controlPath: Playbook.Models.FieldElement;
        public controlList: any;
        public player: Playbook.Interfaces.IPlayer;

        constructor(
            context: Playbook.Interfaces.IRoute, 
            relativeCoordinates: Playbook.Models.RelativeCoordinates, 
            type: Playbook.Models.RouteNodeType
        ) {
            super(context);
            this.player = context.player;
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
        public setContext(context: Playbook.Interfaces.IRoute) {
            this.context = context;
            this.field = context.field;
            this.grid = this.context.grid;
            this.paper = this.context.paper;
            this.placement.refresh();
            this.radius = this.grid.getSize() / 4;
            this.width = this.radius * 2;
            this.height = this.radius * 2;
            this.draw();
        };
        public fromJson(json) {
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
        public toJson() {
            var inherited = super.toJson();
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
        public getCoordinates() {
            return new Playbook.Models.Coordinates(this.placement.coordinates.x, this.placement.coordinates.y);
        };
        public erase() {
            this.paper.remove(this.raphael);
            this.paper.remove(this.actionGraphic.raphael);
        };
        public draw() {
            console.log('draw node');
            this.clear();
            this.raphael = this.paper.circle(this.placement.coordinates.x, this.placement.coordinates.y, this.radius).attr({
                'fill': 'grey',
                'opacity': this.opacity
            });
            this.raphael.node.setAttribute('class', 'grab');
            super.click(this.click, this);
            this.drag(this.dragMove, this.dragStart, this.dragEnd, this, // drag move context
            this, // drag start context
            this // drag end context
            );
            this.hover(this.hoverIn, this.hoverOut, this);
            this.contextmenu(this.contextmenuHandler, this);
            if (this.type == Playbook.Models.RouteNodeType.CurveControl) {
            }
        };
        public clear() {
            this.paper.remove(this.raphael);
        };
        public drawAction() {
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
        public contextmenuHandler(e, self) {
            console.log('route node contextmenu');
            self.paper.canvas.invoke(Playbook.Editor.CanvasActions.RouteNodeContextmenu, 'open route node context menu...', self);
        };
        public hoverIn(e, self) {
            if (!this.disabled && !this.selected) {
                self.toggleOpacity();
                self.raphael.attr({
                    'opacity': self.opacity
                });
            }
        };
        public hoverOut(e, self) {
            if (!this.disabled && !this.selected) {
                self.toggleOpacity();
                self.raphael.attr({
                    'opacity': self.opacity
                });
            }
        };
        public drawControlPaths() {
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
        public click(e, self) {
            console.log('route node:', self);
            self.select();
            self.toggleOpacity();
            self.raphael.attr({ 'opacity': self.opacity });
        };
        public dragMove(dx, dy, posx, posy, e) {
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
        public dragStart(x, y, e) {
            console.log('dragStart() not implemented');
        };
        public dragEnd(e) {
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
        public moveByDelta(dx, dy) {
            this.placement.moveByDelta(dx, dy);
            // route node has been modified
            this.setModified();
        };
        public isCurveNode() {
            return this.type == Playbook.Models.RouteNodeType.CurveControl ||
                this.type == Playbook.Models.RouteNodeType.CurveEnd ||
                this.type == Playbook.Models.RouteNodeType.CurveStart;
        };
        public setAction(action) {
            this.action = action;
            console.log('updating action', this.action);
            this.drawAction();
            // route node has been modified
            this.setModified();
        };
        public toggleSelect() {
            this.selected = !this.selected;
        };
        public select() {
            this.selected = true;
        };
        public deselect() {
            this.selected = false;
        };
        public toggleOpacity() {
            this.opacity = this.opacity == 1 ? 0 : 1;
        };
    }
}
