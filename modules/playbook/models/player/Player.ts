/// <reference path='../models.ts' />

module Playbook.Models {

	// @todo treat Player as a FieldElementSet
	export class Player 
	extends Playbook.Models.FieldElement
	implements Playbook.Interfaces.IPlayer,
	Playbook.Interfaces.IFieldElement,
	Playbook.Interfaces.IPlaceable {

		public placement: Playbook.Models.Placement;
		public position: Playbook.Models.Position;
		public assignment: Playbook.Models.Assignment;

		public data: any;
		public font: any;
		public selectedColor: string;
		public unselectedColor: string;
		public selectedOpacity: number;
		public label: any;
		public indexLabel: any;

		private _isCreatedNewFromAltDisabled: any;
		private _newFromAlt: any;
		private _isDraggingNewFromAlt: any;

		public set: Playbook.Models.FieldElementSet;
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

			this.font = this.paper.getFont('Arial');

			this.placement = placement;
			this.position = position;
			this.assignment = assignment || new Playbook.Models.Assignment();
			this.assignment.positionIndex = this.position.index;

			// assign options
			this.guid = Common.Utilities.guid();

			this.radius = this.grid.getSize() / 2;
			this.color = 'grey';
			this.width = this.grid.getSize();
			this.height = this.grid.getSize();
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


			// the set acts as a group for the other graphical elements
			this.box = new FieldElement(this);
			this.icon = new FieldElement(this);
			this.text = new FieldElement(this);
			this.label = new FieldElement(this);
			this.indexLabel = new FieldElement(this);
			this.set = new FieldElementSet(this);
			this.set.push(this);
		}

		public draw() {			
			//TODO: all of these hard-coded integers are a problem
			
			this.clear();

			this.paper.remove(this.box.raphael);
			this.box.placement.coordinates.ax = this.placement.coordinates.ax - (this.width / 2);
			this.box.placement.coordinates.ay = this.placement.coordinates.ay - (this.width / 2);
			this.box.raphael = this.paper.rect(
				this.box.placement.coordinates.ax,
				this.box.placement.coordinates.ay,
				this.width,
				this.height,
				true
			).attr({
				'stroke-width': 0
			});

			this.box.placement.coordinates.x = this.box.raphael.attr('x');
			this.box.placement.coordinates.y = this.box.raphael.attr('y');
			this.box.width = this.width;
			this.box.height = this.height;

			this.paper.remove(this.icon.raphael);
			this.icon.raphael = this.paper.circle(
				this.placement.coordinates.x,
				this.placement.coordinates.y,
				this.radius
			).attr({
				fill: 'white',
				'stroke': this.unselectedColor,
				'stroke-width': 1,
			});
			this.icon.placement.coordinates.x = this.box.raphael.attr('x');
			this.icon.placement.coordinates.y = this.box.raphael.attr('y');
			this.icon.radius = this.radius;
			this.icon.placement.coordinates.ax = this.icon.placement.coordinates.x + this.radius;
			this.icon.placement.coordinates.ay = this.icon.placement.coordinates.y + this.radius;
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
			this.text.placement.coordinates.ax = this.placement.coordinates.ax;
			this.text.placement.coordinates.ay = this.placement.coordinates.ay + 20; // TODO
			this.text.raphael = this.paper.text(
				this.text.placement.coordinates.ax,
				this.text.placement.coordinates.ay,
				[this.placement.relative.rx, ', ', this.placement.relative.ry].join(''),
				true
			);
			this.text.raphael.node.setAttribute('class', 'no-highlight');

			this.paper.remove(this.label.raphael);
			this.label.placement.coordinates.ax = this.placement.coordinates.ax;
			this.label.placement.coordinates.ay = this.placement.coordinates.ay - ((this.height / 2) * 0.4);
			this.label.raphael = this.paper.text(
				this.label.placement.coordinates.ax,
				this.label.placement.coordinates.ay,
				this.position.label,
				true
			)
			this.label.raphael.node.setAttribute('class', 'no-highlight');

			// Index label - each player is indexed (0 - 10) via the personnel > position
			// assigned to the player; this index is used to correlate assignments with
			// personnel
			this.paper.remove(this.indexLabel.raphael);
			this.indexLabel.placement.coordinates.ax = this.placement.coordinates.ax;
			this.indexLabel.placement.coordinates.ay = this.placement.coordinates.ay + ((this.height / 2) * 0.4);
			this.indexLabel.raphael = this.paper.text(
				this.indexLabel.placement.coordinates.ax,
				this.indexLabel.placement.coordinates.ay,
				(this.position.index).toString(),
				true
			)
			this.indexLabel.raphael.node.setAttribute('class', 'no-highlight');

			this.set.push.apply(this.set, [
					this.icon,
					this.box,
					this.label,
					this.indexLabel,
					this.text
				]
			);
			this.set.click(this.click, this);

			this.text.hide();

			if(this.assignment){
				let route = this.assignment.routes.getOne();
				// TODO: implement route switching
				if (route) {
					route.draw();
				}	
			}
			

			// console.log('player drawn');	
		}

		public clear(): void {

			this.paper.remove(this.box.raphael);
			this.paper.remove(this.icon.raphael);
			this.paper.remove(this.label.raphael);
			this.paper.remove(this.indexLabel.raphael);
			this.set.removeAll();
			this.assignment.clear();
		}

		public mousedown(e: any, self: any) {

			// TODO: enumerate e.which (Event.SHIFT_)
			if (e.which == 3) {
				//console.log('right click');
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

			//console.log('player set', self.set);
			//console.log('player click+shift: ', e.shiftKey);
			//console.log('player click+ctrl: ', e.ctrlKey);
			//console.log('player click+alt: ', e.altKey);
			//console.log('player click+meta: ', e.metaKey);
			
			self.field.togglePlayerSelection(self);

			let toolMode = self.canvas.toolMode;
			switch(toolMode) {
				case Playbook.Editor.ToolModes.Select:
					//console.log('Select player');
					break;
				case Playbook.Editor.ToolModes.Assignment:
					//console.log('Set player assignment');
					break;
			}

			return e.returnValue;
		}
		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any) {
			
			// (snapping) only adjust the positioning of the player
			// for every grid-unit worth of movement
			let snapDx = this.grid.snapPixel(dx);
			let snapDy = this.grid.snapPixel(dy);
			this.placement.coordinates.dx = snapDx;
			this.placement.coordinates.dy = snapDy;

			// do not allow dragging while in route mode
			if (this.canvas.toolMode == Playbook.Editor.ToolModes.Assignment) {
				//console.log('drawing route', dx, dy, posx, posy);

				if (!this.assignment) {
					this.assignment = new Playbook.Models.Assignment();
					this.assignment.positionIndex = this.position.index;
				}

				let route = this.assignment.routes.getOne();

				// TODO: Implement route switching
				if (!route) {
					//console.log('creating route');
					let newRoute = new Playbook.Models.Route(this, true);
					this.assignment.routes.add(newRoute);
					route = this.assignment.routes.get(newRoute.guid);
				}
				if (route.dragInitialized) {

					let coords = new Playbook.Models.Coordinates(
						this.placement.coordinates.ax + snapDx,
						this.placement.coordinates.ay + snapDy
					);

					route.initializeCurve(coords, e.shiftKey);
				}

				// prevent remaining logic from getting executed.
				return;
				
			} else if (this.canvas.toolMode == Playbook.Editor.ToolModes.Select) {
				//console.log('dragging player & route');
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
				
				if (this.grid.isDivisible(dx) && this.grid.isDivisible(dy)) {
					//console.log('snap:', snapDx, snapDy);
				}

				if(context.set) {
					// apply the transform to the group
					context.set.dragAll(snapDx, snapDy);	
				}				
				
				let coords = context.getCoordinates(
					
				);

				if (!context.placement)
					throw new Error('Player dragMove(): placement is null or undefined');

				// Update the placement to track for modification
				context.placement.updateCoordinates(
					context.placement.coordinates.ax + snapDx,
					context.placement.coordinates.ay + snapDy
				);

				if (context.text) {
					context.text.raphael.attr({
						text: [
							context.placement.coordinates.rx,
							', ',
							context.placement.coordinates.ry
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
				//console.log('left click, do not drag');
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
				let route = this.assignment.routes.getOne();
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

		public onkeypress() {
		}

		public getPositionRelativeToBall(): Playbook.Models.RelativeCoordinates {
			return this.placement.relative;
		}

		public getCoordinatesFromAbsolute(): Playbook.Models.Coordinates {
			return this.placement.coordinates;
		}

		public hasPlacement(): boolean {
			return this.placement != null;
		}
		public hasPosition(): boolean {
			return this.position != null;
		}
	}
}