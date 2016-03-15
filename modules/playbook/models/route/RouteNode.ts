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

	// Maintains a list of actions that can be taken
	// at each route node
	export enum RouteNodeActions {
		None,
		Block,
		Delay,
		Continue, // TODO: is there another name?
		Juke,
		ZigZag
	}

	export class RouteNode
		extends Playbook.Models.FieldElement {

		public context: Playbook.Interfaces.IRoute;
		public paper: Playbook.Interfaces.IPaper;
		public grid: Playbook.Interfaces.IGrid;
		public field: Playbook.Interfaces.IField;
		public player: Playbook.Interfaces.IPlayer;
		
		public node: Common.Models.LinkedListNode<Playbook.Models.RouteNode>;
		public type: Playbook.Models.RouteNodeType;
		public action: Playbook.Models.RouteNodeActions;
		public disabled: boolean;
		public selected: boolean;
		public controlList: Common.Models.LinkedList<any>;
		public actionGraphic: Playbook.Models.FieldElement;
		public actionable: boolean;
		public opacity: number;

		//TODO
		public controlPath: Playbook.Models.FieldElement;

		constructor(
			context: Playbook.Models.Route,
			coords: Playbook.Models.Coordinate,
			type: Playbook.Models.RouteNodeType
		) {
			super(context);
			
			if(coords) {
				this.x = coords.x;
				this.y = coords.y;

				if (this.grid) {
					let absCoords = this.grid.getPixelsFromCoordinates(coords);
					this.ax = absCoords.x;
					this.ay = absCoords.y;
					this.cx = this.ax;
					this.cy = this.ay;
					this.ox = this.ax;
					this.oy = this.ay;
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
			this.field = this.context.field;
			this.grid = this.context.grid;
			this.paper = this.context.paper;

			let coords = new Playbook.Models.Coordinate(this.x, this.y);
			let absCoords = this.grid.getPixelsFromCoordinates(coords);
			this.ax = absCoords.x;
			this.ay = absCoords.y;
			this.cx = this.ax;
			this.cy = this.ay;
			this.ox = this.ax;
			this.oy = this.ay;
			this.radius = this.grid.getSize() / 4;
			this.width = this.radius * 2;
			this.height = this.radius * 2;

			this.draw();
		}

		public fromJson(json: any) {
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

			this.ax = json.ax;
			this.ay = json.ay;
			this.dx = json.dx;
			this.dy = json.dy;
			this.ox = json.ox;
			this.oy = json.oy;
			this.cx = json.cx;
			this.cy = json.cy;
			this.x = json.x;
			this.y = json.y;

			// route node has been modified
			this.setModified();
		}

		public toJson(): any {
			let inherited = super.toJson();
			let self = {
				type: this.type,
				action: this.action,
				disabled: this.disabled,
				selected: this.selected,
				controlList: null, // TODO: deprecate?
				actionable: this.actionable,
				opacity: this.opacity
			}
			return $.extend(inherited, self);
		}

		public getCoordinates(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(this.x, this.y);
		}

		public erase() {
			this.paper.remove(this.raphael);
			this.paper.remove(this.actionGraphic.raphael);
		}

		public draw() {
			console.log('draw node');

			this.clear();

			this.raphael = this.paper.circle(
				this.x,
				this.y,
				this.radius
			).attr({
				'fill': 'grey',
				'opacity': this.opacity
			});
			this.raphael.node.setAttribute('class', 'grab');
			super.click(this.click, this);

			this.drag(
				this.dragMove,
				this.dragStart,
				this.dragEnd,
				this, // drag move context
				this, // drag start context
				this // drag end context
			);

			this.hover(
				this.hoverIn,
				this.hoverOut,
				this
			);

			this.contextmenu(this.contextmenuHandler, this);

			if (this.type == Playbook.Models.RouteNodeType.CurveControl) {
				//this.drawControlPaths();
			}
		}

		public clear(): void {
			this.paper.remove(this.raphael);
		}

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

					let theta = this.paper.theta(
						this.node.prev.data.ax,
						this.node.prev.data.ay,
						this.ax,
						this.ay
					);

					let thetaDegrees = this.paper.toDegrees(theta);

					console.log('theta: ', theta, thetaDegrees);

					this.actionGraphic.x = this.x - 0.5;
					this.actionGraphic.y = this.y;
					this.actionGraphic.width = this.width * 2;
					this.actionGraphic.height = this.height * 2;
					this.actionGraphic.ax = this.ax - this.width;
					this.actionGraphic.ay = this.ay;
					let pathStr: string = this.paper.getPathString(true, [
						this.actionGraphic.ax,
						this.actionGraphic.ay,
						this.actionGraphic.ax + (this.width * 2),
						this.actionGraphic.ay
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
					this.actionGraphic.x = this.x - 0.5;
					this.actionGraphic.y = this.y - 0.5;
					this.actionGraphic.width = this.width * 2;
					this.actionGraphic.height = this.height * 2;
					this.actionGraphic.raphael = this.paper.rect(
						this.actionGraphic.x,
						this.actionGraphic.y,
						this.actionGraphic.width,
						this.actionGraphic.height
					).attr({
						'stroke': 'orange',
						'stroke-width': 1
					});
					this.actionGraphic.raphael.node.setAttribute('class', 'painted-fill');

					break;
			}
		}

		public contextmenuHandler(e: any, self: any) {
			console.log('route node contextmenu');
			self.paper.canvas.invoke(
				Playbook.Editor.CanvasActions.RouteNodeContextmenu,
				'open route node context menu...',
				self
			);
		}

		public hoverIn(e: any, self: any) {
			if (!this.disabled && !this.selected) {
				self.toggleOpacity();
				self.raphael.attr({
					'opacity': self.opacity
				});
			}
		}

		public hoverOut(e: any, self: any) {
			if (!this.disabled && !this.selected) {
				self.toggleOpacity();
				self.raphael.attr({
					'opacity': self.opacity
				});
			}
		}

		public drawControlPaths() {
			let start, control, end;
			if (this.type == Playbook.Models.RouteNodeType.CurveControl) {
				if (!this.node.next || !this.node.prev) {
					console.log('control does not have next and prev nodes');
					return null;
				}
				start = this.node.prev.data;
				control = this;
				end = this.node.next.data;

			} else if (this.type == Playbook.Models.RouteNodeType.CurveEnd) {
				if (!this.node.prev || !this.node.prev.prev) {
					console.log(['end node does not have previous control or previous',
						'curve start nodes'].join(''));
					return null;
				}
				start = this.node.prev.prev.data;
				control = this.node.prev.data;
				end = this;

			} else if (this.type == Playbook.Models.RouteNodeType.CurveStart) {
				if (!this.node.next || !this.node.next.next) {
					console.log(['curve start node does not have subsequent',
						'control and end nodes'].join(''));
					return null;
				}
				start = this;
				control = this.node.next.data;
				end = this.node.next.next.data;
			}

			let pathStr = this.paper.getPathStringFromNodes(
				true,
				[start, control, end]
			);

			console.log(pathStr);

			start.paper.remove(start.controlPath.raphael);

			start.controlPath.raphael = start.paper.path(pathStr).attr({
				'stroke': 'grey',
				'stroke-width': 1,
				'opacity': 0.2,
			});

			// this is referring to the player.
			this.player.set.exclude(start.controlPath);
			this.player.set.push(start.controlPath)
		}

		public click(e: any, self: any) {
			console.log('route node:', self);
			self.select();
			self.toggleOpacity();
			self.raphael.attr({'opacity': self.opacity});
		}

		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
			if (this.disabled) {
				return;
			}

			// (snapping) only adjust the positioning of the player
			// for every grid-unit worth of movement
			let snapDx = this.grid.snapPixel(dx);
			let snapDy = this.grid.snapPixel(dy);
			this.moveByDelta(snapDx, snapDy);

			let gridCoords = this.grid.getGridCoordinatesFromPixels(
				new Playbook.Models.Coordinate(this.ax, this.ay)
			);
			this.x = gridCoords.x;
			this.y = gridCoords.y;

			console.log(
				this.ox,
				this.oy,
				this.ax,
				this.ay,
				this.cx,
				this.cy,
				this.dx,
				this.dy,
				this.x,
				this.y
			);

			this.raphael.transform(['t', this.dx, ', ', this.dy].join(''));

			if (this.actionGraphic.raphael) {
				this.actionGraphic.dx = snapDx - 0.5;
				this.actionGraphic.dy = snapDy - 0.5;
				this.actionGraphic.ax = this.ox + this.dx - 0.5;
				this.actionGraphic.ay = this.oy + this.dy - 0.5;
				this.actionGraphic.x = gridCoords.x - 0.5;
				this.actionGraphic.y = gridCoords.y - 0.5;

				this.actionGraphic.raphael.transform(['t', this.actionGraphic.dx, ', ', this.actionGraphic.dy].join(''));


				let theta = this.paper.theta(
					this.node.prev.data.ax,
					this.node.prev.data.ay,
					this.ax,
					this.ay
				);

				let thetaDegrees = this.paper.toDegrees(theta);
				console.log('rotating action', theta, thetaDegrees);
				this.actionGraphic.raphael.rotate((90 - thetaDegrees));
			}

			// redraw the path
			if (this.isCurveNode()) {
				console.log('dragging control:', this.type);
		
				//this.drawControlPaths();
			}

			this.context.draw();

		}
		public dragStart(x: number, y: number, e: any): void {
			console.log('dragStart() not implemented');
		}
		public dragEnd(e: any): void {
			this.raphael.transform(['t', 0, ', ', 0].join(''));
			this.ox = this.ax;
			this.oy = this.ay;
			this.dx = 0;
			this.dy = 0;
			this.raphael.attr({
				cx: this.ax,
				cy: this.ay
			});

			if (this.actionGraphic.raphael) {
				this.actionGraphic.raphael.transform(['t', 0, ', ', 0].join(''));
				this.actionGraphic.ox = this.actionGraphic.ax;
				this.actionGraphic.oy = this.actionGraphic.ay;
				this.actionGraphic.dx = 0;
				this.actionGraphic.dy = 0;

				// this.actionGraphic.raphael.attr({
				// 	x: this.actionGraphic.ax - (this.actionGraphic.width / 2),
				// 	y: this.actionGraphic.ay - (this.actionGraphic.height / 2)
				// });
				this.drawAction();
			}

			// route node has been modified
			this.setModified();
		}

		public moveByDelta(dx: number, dy: number) {
			this.dx = dx;
			this.dy = dy;
			this.ax = this.ox + this.dx;
			this.ay = this.oy + this.dy;
			this.cx = this.ax;
			this.cy = this.ay;

			// route node has been modified
			this.setModified();
		}

		public isCurveNode() {
			return this.type == Playbook.Models.RouteNodeType.CurveControl ||
				this.type == Playbook.Models.RouteNodeType.CurveEnd ||
				this.type == Playbook.Models.RouteNodeType.CurveStart;
		}

		public setAction(action: Playbook.Models.RouteNodeActions) {
			this.action = action;
			console.log('updating action', this.action);
			this.drawAction();

			// route node has been modified
			this.setModified();
		}

		public toggleSelect() {
			this.selected = !this.selected;
		}

		public select() {
			this.selected = true;
		}

		public deselect() {
			this.selected = false;
		}

		public toggleOpacity() {
			this.opacity = this.opacity == 1 ? 0 : 1;
		}
	}

}