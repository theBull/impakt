/// <reference path='../models.ts' />

module Playbook.Models {

	// @todo treat Player as a FieldElementSet
	export class Player extends FieldElement {

		public placement: Playbook.Models.Placement;
		public position: Playbook.Models.Position;
		public assignment: Playbook.Models.Assignment;

		public teamMember: TeamMember;
		public data: any;
		public font: any;
		public selectedColor: string;
		public unselectedColor: string;
		public selectedOpacity: number;
		public label: any;

		private _isCreatedNewFromAltDisabled: any;
		private _newFromAlt: any;
		private _isDraggingNewFromAlt: any;

		public set: any;
		public icon: FieldElement;
		public box: FieldElement;
		public text: FieldElement;

		constructor(
			context: Playbook.Models.Field,
			placement: Playbook.Models.Placement,
			position: Playbook.Models.Position,
			assignment: Playbook.Models.Assignment
		) {
			super(context);

			// console.log('constructing player...');

			this.context = context;
			this.field = context;
			this.ball = this.field.ball;
			this.grid = this.field.grid;
			this.canvas = this.field.canvas;
			this.paper = this.field.paper;
			this.font = this.paper.getFont('Arial');

			this.placement = placement;
			this.position = position;
			this.assignment = assignment || new Playbook.Models.Assignment();
			this.assignment.positionIndex = this.position.index;

			// assign options
			this.id = Common.Utilities.randomId();
			this.guid = Common.Utilities.guid();

			var absCoords = this.grid.getPixelsFromCoordinates(
				new Playbook.Models.Coordinate(
					this.placement.x, 
					this.placement.y
				)
			);
			this.ax = absCoords.x;
			this.ay = absCoords.y;
			let ballCoords = this.getPositionRelativeToBall();
			this.bx = ballCoords.x;
			this.by = ballCoords.y;

			this.radius = this.field.grid.GRIDSIZE / 2;
			this.color = 'grey';
			this.width = this.field.grid.GRIDSIZE;
			this.height = this.field.grid.GRIDSIZE;
			this.opacity = 0.2;

			this.selected = false;
			this.selectedColor = 'red';
			this.unselectedColor = 'black';
			this.selectedOpacity = 1;

			this._isCreatedNewFromAltDisabled = false;
			this._newFromAlt = null;
			this._isDraggingNewFromAlt = false;

			this.contextmenuTemplateUrl
				= 'modules/playbook/editor/canvas/player/playbook-editor-canvas-player-contextmenu.tpl.html';


			this.box = new FieldElement(this);
			this.icon = new FieldElement(this);
			this.text = new FieldElement(this);
			this.label = new FieldElement(this);
			this.set = new FieldElementSet(this);
			this.set.push(this);
		}

		public draw() {			
			//TODO: all of these hard-coded integers are a problem

			this.paper.remove(this.box.raphael);
			this.box.ax = this.ax - (this.width / 2);
			this.box.ay = this.ay - (this.width / 2);
			this.box.raphael = this.paper.rect(
				this.box.ax,
				this.box.ay,
				this.width,
				this.height,
				true
			).attr({
				'stroke-width': 0
			});

			this.box.x = this.box.raphael.attr('x');
			this.box.y = this.box.raphael.attr('y');
			this.box.width = this.width;
			this.box.height = this.height;

			this.paper.remove(this.icon.raphael);
			this.icon.raphael = this.paper.circle(
				this.placement.x,
				this.placement.y,
				this.radius
			).attr({
				fill: 'white',
				'stroke': this.unselectedColor,
				'stroke-width': 1,
			});
			this.icon.x = this.box.raphael.attr('x');
			this.icon.y = this.box.raphael.attr('y');
			this.icon.radius = this.radius;
			this.icon.ax = this.icon.x + this.radius;
			this.icon.ay = this.icon.y + this.radius;
			this.icon.width = this.radius * 2;
			this.icon.height = this.radius * 2;

			this.icon.hover(
				this.hoverIn,
				this.hoverOut,
				this
			);
			this.icon.drag(
				this.dragMove,
				this.dragStart,
				this.dragEnd,
				this, // drag move context
				this, // drag start context
				this // drag end context
			);

			this.icon.mousedown(this.mousedown, this);


			this.paper.remove(this.text.raphael);
			this.text.ax = this.ax;
			this.text.ay = this.ay + 20; // TODO
			this.text.raphael = this.paper.text(
				this.text.ax,
				this.text.ay,
				[this.bx, ', ', this.by].join(''),
				true
			);
			this.text.raphael.node.setAttribute('class', 'no-highlight');

			this.paper.remove(this.label.raphael);
			this.label.ax = this.ax;
			this.label.ay = this.ay;
			this.label.raphael = this.paper.text(
				this.label.ax,
				this.label.ay,
				this.position.label,
				true
			)
			this.label.raphael.node.setAttribute('class', 'no-highlight');

			this.set.push.apply(this.set, [
					this.icon,
					this.box,
					this.label,
					this.text
				]
			);
			this.set.click(this.click, this);

			this.text.hide();

			if(this.assignment){
				let route = this.assignment.routes.getOne<Playbook.Models.Route>();
				// TODO: implement route switching
				if (route) {
					route.draw();
				}	
			}
			

			// console.log('player drawn');	
		}

		public mousedown(e: any, self: any) {

			// TODO: enumerate e.which (Event.SHIFT_)
			if (e.which == 3) {
				console.log('right click');
				self.canvas.invoke(
					Playbook.Editor.CanvasActions.PlayerContextmenu,
					'open player context menu...',
					self
				);
			}
		}

		public hoverIn(e: any, self: any) {
			self.icon.setFillOpacity(0.5);
		}
		public hoverOut(e: any, self: any) {
			self.icon.setFillOpacity(1);
		}
		public click(e: any, self: any) {
			if (e.ctrlKey) {
				e.preventDefault();
				if (e.isDefaultPrevented()) {
					// default event is prevented
				} else {
					e.returnValue = false;
				}
			}

			console.log('player set', self.set);

			console.log('player click+shift: ', e.shiftKey);
			console.log('player click+ctrl: ', e.ctrlKey);
			console.log('player click+alt: ', e.altKey);
			console.log('player click+meta: ', e.metaKey);
			
			self.field.togglePlayerSelection(self);

			let editorMode = self.canvas.editorMode;
			switch(editorMode) {
				case Playbook.Editor.EditorModes.Select:
					console.log('Select player');
					break;
				case Playbook.Editor.EditorModes.Assignment:
					console.log('Set player assignment');
					break;
			}

			return e.returnValue;
		}
		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any) {
			
			// (snapping) only adjust the positioning of the player
			// for every grid-unit worth of movement
			let snapDx = this.grid.snapPixel(dx);
			let snapDy = this.grid.snapPixel(dy);
			this.dx = snapDx;
			this.dy = snapDy;

			// do not allow dragging while in route mode
			if (this.canvas.editorMode == Playbook.Editor.EditorModes.Assignment) {
				console.log('drawing route', dx, dy, posx, posy);

				if (!this.assignment) {
					this.assignment = new Playbook.Models.Assignment();
					this.assignment.positionIndex = this.position.index;
				}

				let route = this.assignment.routes.getOne<Playbook.Models.Route>();

				// TODO: Implement route switching
				if (!route) {
					console.log('creating route');
					let newRoute = new Playbook.Models.Route(this, true);
					this.assignment.routes.add(newRoute.guid, newRoute);
					route = this.assignment.routes.get<Playbook.Models.Route>(newRoute.guid);
				}
				if (route.dragInitialized) {

					let coords = new Playbook.Models.Coordinate(
						this.ax + snapDx,
						this.ay + snapDy
					);

					route.initializeCurve(coords, e.shiftKey);
				}
				return;
			} else if (this.canvas.editorMode == Playbook.Editor.EditorModes.Select) {
				console.log('dragging player & route');
			}

			// console.log(e.which);
			if(e.which == 82) { // R
				// draw line from player
				// 
				return;
			}
			else if(!e.shiftKey && e.which != 3) {

				var context = this._newFromAlt ? this._newFromAlt : this;
				var grid = this.grid;

				// alt-drag
				if (e.altKey && !this._isCreatedNewFromAltDisabled) {

					var newPlayer = this.field.addPlayer(
						this.placement,
						this.position,
						null
					)
			
					context = this.field.players[newPlayer.guid];

					this._newFromAlt = context;
					this._isCreatedNewFromAltDisabled = true;
					this._isDraggingNewFromAlt = true;
				}
				
				this.dragged = snapDx != 0 || snapDy != 0;
				
				if (this.grid.isDivisible(dx) && this.grid.isDivisible(dy))
					console.log('snap:', snapDx, snapDy);

				if(context.set) {
					// apply the transform to the group
					context.set.dragAll(snapDx, snapDy);	
				}				
				
				let coords = context.getCoordinates(
					context.ax + snapDx,
					context.ay + snapDy
				);

				if (context.placement) {
					context.placement.x = coords.x;
					context.placement.y = coords.y;
				}

				let toBall = context.getPositionRelativeToBall();
				context.bx = toBall.x;
				context.by = toBall.y;

				if(context.text) {
					context.text.raphael.attr({
						text: [
							context.bx,
							', ',
							context.by
						].join('')
					});
				}				
				

			} else if(e.shiftKey) {
				// shift key clicked
				// if(!this.route) {
				// 	//this.route = new Route();
				// 	console.log('creating route');
				// }
			} else if(e.which == 3) {
				console.log('left click, do not drag');
			}
		}
		public dragStart(x: number, y: number, e: any) {
			this.dragging = true;
			this.text.show();
			this.field.togglePlayerSelection(this);
			//this.set.setOriginalPositions();
			// console.log('start drag: ', this.ax, this.ay);
		}
		public dragEnd(e: any) {
			this.dragging = false;
			this._isCreatedNewFromAltDisabled = false;
			this._isDraggingNewFromAlt = true;
			this._newFromAlt = null;
			
			if (this.dragged) {
				this.set.drop();
				this.dragged = false;
			}

			if(this.assignment) {
				// TODO: implement route switching
				let route = this.assignment.routes.getOne<Playbook.Models.Route>();
				if (route) {
					if (route.dragInitialized) {
						route.dragInitialized = false;
					}
					route.draw();
					if (route.nodes && 
						route.nodes.root && 
						route.nodes.root.data.isCurveNode()) {
						//route.root.data.drawControlPaths();
					}
				}
			}

			this.text.hide();
		}

		public getPositionRelativeToBall() {
			return new Playbook.Models.RelativePosition(
				this, this.ball
			);
		}

		public getCoordinatesFromAbsolutePosition()
			: Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(
				this.ax, this.ay
			);
		}

		public getCoordinates(px: number, py: number)
			: Playbook.Models.Coordinate {
			let toPixelCoords = new Playbook.Models.Coordinate(
				px, py
			);
			let toGridCoords = this.grid.getGridCoordinatesFromPixels(
				toPixelCoords
			);
			return toGridCoords;
		}

		public select(isSelected?: boolean) {
			this.selected = isSelected != null && isSelected != undefined ? 
				isSelected : !this.selected;

			let strokeColor = this.selected ?
				this.selectedColor :
				this.unselectedColor;
				
			this.icon.raphael.attr({
				'stroke': strokeColor
			});
		}

		public clearRoute() {
		}

		public setRouteFromDefaults(routeTitle: string) {
		}

		public getSaveData() {
		}

		public onkeypress() {
		}

		public hasPlacement(): boolean {
			return this.placement != null;
		}
		public hasPosition(): boolean {
			return this.position != null;
		}
	}
}