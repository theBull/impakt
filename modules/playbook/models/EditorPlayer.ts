/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayer 
	extends Common.Models.Player
	implements Common.Interfaces.IPlayer {

		private _isCreatedNewFromAltDisabled: any;
		private _newFromAlt: any;
		private _isDraggingNewFromAlt: any;
		private _originalScreenPositionX: number;
		private _originalScreenPositionY: number;

		constructor(
			field: Common.Interfaces.IField,
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		) {
			super(field, placement, position, assignment);

			this._isCreatedNewFromAltDisabled = false;
			this._newFromAlt = null;
			this._isDraggingNewFromAlt = false;
			this._originalScreenPositionX = null;
			this._originalScreenPositionY = null;

			this.contextmenuTemplateUrl
				= 'modules/playbook/editor/canvas/player/playbook-editor-canvas-player-contextmenu.tpl.html';

			// the set acts as a group for the other graphical elements
			this.selectionBox = new Playbook.Models.EditorPlayerSelectionBox(this);
			this.icon = new Playbook.Models.EditorPlayerIcon(this);
			this.relativeCoordinatesLabel = new Playbook.Models.EditorPlayerRelativeCoordinatesLabel(this);
			this.personnelLabel = new Playbook.Models.EditorPlayerPersonnelLabel(this);
			this.indexLabel = new Playbook.Models.EditorPlayerIndexLabel(this);

			this.layer.addLayer(this.selectionBox.layer);
			this.layer.addLayer(this.icon.layer);
			this.layer.addLayer(this.relativeCoordinatesLabel.layer);
			this.layer.addLayer(this.personnelLabel.layer);
			this.layer.addLayer(this.indexLabel.layer);

			let self = this;
			this.icon.layer.onModified(function() {
				console.log('editor player modified');
				self.setModified(true);
			});
		}

		public draw() {
			/**
			 * Player selection box
			 */
			this.selectionBox.draw();

			/**
			 *	Player icon
			 */
			this.icon.draw();
			this.icon.layer.graphics.ondrag(
				this.dragMove, 
				this.dragStart, 
				this.dragEnd,
				this
			);

			/**
			 * Relative Coordinates Text
			 */
			this.relativeCoordinatesLabel.draw();

			/**
			 * Personnel Label
			 */
			this.personnelLabel.draw();
			
			/**
			 * Index label
			 */
			this.indexLabel.draw();

			// Draw the player's assignment
			if(this.assignment){
				let route = this.assignment.routes.getOne();
				// TODO: implement route switching
				if (route) {
					route.draw();
				}	
			}
		}

		public remove(): void {
			this.layer.remove();
			this.assignment.remove();
		}

		public mousedown(e: any) {

			// TODO: enumerate e.which (Event.SHIFT_)
			if (e.which == Common.Input.Which.RightClick) {
				//console.log('right click');
				this.canvas.listener.invoke(
					Playbook.Enums.Actions.PlayerContextmenu,
					this
				);
			}
		}

		public click(e: any) {
			if (e.ctrlKey) {
				e.preventDefault();
				if (e.isDefaultPrevented()) {
					// default event is prevented
				} else {
					e.returnValue = false;
				}
			}
			
			// Toggle the selection of this player
			this.field.toggleSelection(this);

			// determine the tool currently selected
			let toolMode = this.canvas.toolMode;

			switch(toolMode) {
				case Playbook.Enums.ToolModes.Select:
					//console.log('Select player');
					break;
				case Playbook.Enums.ToolModes.Assignment:
					//console.log('Set player assignment');
					break;
			}

			return e.returnValue;
		}
		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any) {
			// Ignore drag motions under specified threshold to prevent
			// click/mousedown from triggering drag method
			if (!this._isOverDragThreshold(dx, dy))
				return;

			// (snapping) only adjust the positioning of the player
			// for every grid-unit worth of movement
			let snapDx = dx;//this.grid.snapPixel(dx);
			let snapDy = dy;//this.grid.snapPixel(dy);
			console.log(snapDx, snapDy);
			this.layer.graphics.dragged = true;

			// do not allow dragging while in route mode
			if (this.canvas.toolMode == Playbook.Enums.ToolModes.Assignment) {
				//console.log('drawing route', dx, dy, posx, posy);

				if (!this.assignment) {
					this.assignment = new Common.Models.Assignment();
					this.assignment.positionIndex = this.position.index;
				}

				let route = this.assignment.routes.getOne();

				// TODO: Implement route switching
				if (!route) {
					//console.log('creating route');
					let newRoute = new Playbook.Models.EditorRoute(this, true);
					this.assignment.routes.add(newRoute);
					route = this.assignment.routes.get(newRoute.guid);
				}
				if (route.dragInitialized) {

					let coords = new Common.Models.Coordinates(
						this.layer.graphics.location.ax + snapDx,
						this.layer.graphics.location.ay + snapDy
					);

					route.initializeCurve(coords, e.shiftKey);
				}

				// prevent remaining logic from getting executed.
				return;
				
			} else if (this.canvas.toolMode == Playbook.Enums.ToolModes.Select) {
				//console.log('dragging player & route');
			}

			if(e.which == Common.Input.Which.r) {
				// draw line from player
				return;
			}
			else if(!e.shiftKey && e.which != Common.Input.Which.RightClick) {

				let context = this._newFromAlt ? this._newFromAlt : this;
				let grid = this.grid;

				// alt-drag
				if (e.altKey && !this._isCreatedNewFromAltDisabled) {

					var newPlayer = this.field.addPlayer(
						this.layer.graphics.placement,
						this.position,
						null
					)
			
					context = this.field.players[newPlayer.guid];

					this._newFromAlt = context;
					this._isCreatedNewFromAltDisabled = true;
					this._isDraggingNewFromAlt = true;
				}
				
				if (this.grid.isDivisible(dx) && this.grid.isDivisible(dy)) {
					//console.log('snap:', snapDx, snapDy);
				}

				// Update the placement to track for modification
				this.layer.moveByDelta(snapDx, snapDy);

				// Update relative coordinates label, if it exists
				if(this.relativeCoordinatesLabel)
					this.relativeCoordinatesLabel.layer.graphics.text([
						this.layer.graphics.placement.relative.rx,
						', ',
						this.layer.graphics.placement.relative.ry
					].join(''));
										

			} else if(e.shiftKey) {
				// shift key clicked
				// if(!this.route) {
				// 	//this.route = new Route();
				// 	console.log('creating route');
				// }
			} else if(e.which == Common.Input.Which.RightClick) {
				//console.log('right click, do not drag');
			}
		}
		public dragStart(x: number, y: number, e: any) {
			this._setOriginalDragPosition(x, y);

			if(this._isOverDragThreshold(
				this._originalScreenPositionX - x, 
				this._originalScreenPositionY - y)) {
				
				this.layer.graphics.dragging = true;

				if (this.relativeCoordinatesLabel)
					this.relativeCoordinatesLabel.layer.show();

				this.field.toggleSelection(this);
			}
		}
		public dragEnd(e: any) {
			this._isCreatedNewFromAltDisabled = false;
			this._isDraggingNewFromAlt = true;
			this._newFromAlt = null;
			this._setOriginalDragPosition(null, null);
			
			this.drop();
			
			this.layer.graphics.dragging = false;

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
						//route.root.data.routeControlPath.draw();
					}
				}
			}

			if(this.relativeCoordinatesLabel)
				this.relativeCoordinatesLabel.layer.hide();
		}

		public clearRoute() {
		}

		public setRouteFromDefaults(routeTitle: string) {
		}

		public onkeypress() {
		}

		public getPositionRelativeToBall(): Common.Models.RelativeCoordinates {
			return this.layer.graphics.placement.relative;
		}

		public getCoordinatesFromAbsolute(): Common.Models.Coordinates {
			return this.layer.graphics.placement.coordinates;
		}

		public hasPlacement(): boolean {
			return this.layer.graphics.placement != null;
		}
		public hasPosition(): boolean {
			return this.position != null;
		}

		private _setOriginalDragPosition(x: number, y: number) {
			this._originalScreenPositionX = x;
			this._originalScreenPositionY = y;
		}

		private _isOriginalDragPositionSet(): boolean {
			return !Common.Utilities.isNull(this._originalScreenPositionX) &&
				!Common.Utilities.isNull(this._originalScreenPositionY);
		}

		private _isOverDragThreshold(x, y): boolean {
			return Math.abs(x) > Playbook.Constants.DRAG_THRESHOLD_X ||
				Math.abs(y) > Playbook.Constants.DRAG_THRESHOLD_Y;
		}
	}
}