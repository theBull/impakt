/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayer 
	extends Common.Models.Player
	implements Common.Interfaces.IPlayer {

		constructor(
			field: Common.Interfaces.IField,
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		) {
			super(field, placement, position, assignment);

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
			if (!this.isOverDragThreshold(dx, dy))
				return;
			
			this.layer.graphics.dragged = true;

			// do not allow dragging while in route mode
			if (this.canvas.toolMode == Playbook.Enums.ToolModes.Assignment) {

				if (!this.assignment) {
					this.assignment = new Common.Models.Assignment(this.position.unitType);
					this.assignment.positionIndex = this.position.index;
				}

				let route = this.assignment.routes.getOne();

				// TODO: Implement route switching
				if (!route) {
					let newRoute = new Playbook.Models.EditorRoute(this, true);
					this.assignment.routes.add(newRoute);
					route = this.assignment.routes.get(newRoute.guid);
				}
				if (route.dragInitialized) {

					let coords = new Common.Models.Coordinates(
						this.layer.graphics.location.ax + dx,
						this.layer.graphics.location.ay + dy
					);

					route.initializeCurve(coords, e.shiftKey);
				}

				// prevent remaining logic from getting executed.
				return;

			} else if (!e.shiftKey && e.which != Common.Input.Which.RightClick) {

				// Update the placement to track for modification
				this.layer.moveByDelta(dx, dy);

				// Update relative coordinates label, if it exists
				if (this.relativeCoordinatesLabel) {
					this.relativeCoordinatesLabel.layer.graphics.text([
						this.layer.graphics.placement.relative.rx,
						', ',
						this.layer.graphics.placement.relative.ry
					].join(''));
				}
										
			} else if (this.canvas.toolMode == Playbook.Enums.ToolModes.Select) {
				//console.log('dragging player & route');
			} else if (e.shiftKey) {
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
			super.dragStart(x, y, e);

			if (this.relativeCoordinatesLabel)
				this.relativeCoordinatesLabel.layer.show();

			this.field.toggleSelection(this);
		}
		public dragEnd(e: any) {
			super.dragEnd(e);
			
			this.drop();
			
			if(this.assignment) {
				// TODO: implement route switching
				let route = this.assignment.routes.getOne();
				if (route) {
					if (route.dragInitialized) {
						route.dragInitialized = false;
					}
					
					route.draw();
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
	}
}