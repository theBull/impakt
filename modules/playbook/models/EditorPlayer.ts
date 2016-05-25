/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayer 
	extends Common.Models.Player
	implements Common.Interfaces.IPlayer {

		constructor(
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		) {
			super(placement, position, assignment);
		}

		public initialize(field: Common.Interfaces.IField): void {
			super.initialize(field);

			// the set acts as a group for the other graphical elements
			this.selectionBox = new Playbook.Models.EditorPlayerSelectionBox(this);
			this.icon = new Playbook.Models.EditorPlayerIcon(this);
			this.relativeCoordinatesLabel = new Playbook.Models.EditorPlayerRelativeCoordinatesLabel(this);
			this.personnelLabel = new Playbook.Models.EditorPlayerPersonnelLabel(this);
			this.indexLabel = new Playbook.Models.EditorPlayerIndexLabel(this);
			this.renderType = Common.Enums.RenderTypes.Editor;

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

			// parse route json data 
			// don't render the assignments if the editor type is of type Formation
			if (Common.Utilities.isNotNullOrUndefined(this.assignment) && 
				this.field.editorType != Playbook.Enums.EditorTypes.Formation
			) {
				this.assignment.listen(false);
				this.assignment.setRoutes(this, Common.Enums.RenderTypes.Editor);
				this.assignment.listen(true);
			}

			this.contextmenuTemplateUrl = Common.Constants.PLAYER_CONTEXTMENU_TEMPLATE_URL;
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
			this.icon.graphics.ondrag(
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

			this.drawRoute();
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
			
			this.toggleSelect(e.metaKey);

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
		public toggleSelect(metaKey: boolean): void {
			// Toggle the selection of this player
			this.icon.toggleSelect(metaKey);
			if (metaKey) {
				this.field.toggleSelection(this);
			} else {
				this.field.setSelection(this);
			}
		}
		public deselect(): void {
			this.icon.deselect();
		}
		public select(): void {
			this.icon.select();
		}
		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any) {
			// Ignore drag motions under specified threshold to prevent
			// click/mousedown from triggering drag method
			if (!this.dragging && !this.isOverDragThreshold(dx, dy)) {
				return;
			} else {
				this.dragging = true;
				if(this.relativeCoordinatesLabel)
					this.relativeCoordinatesLabel.layer.show();
			}
			
			// do not allow dragging while in route mode
			if (this.canvas.toolMode == Playbook.Enums.ToolModes.Assignment) {

				if (!this.assignment) {
					this.assignment = new Common.Models.Assignment(this.position.unitType);
					this.assignment.positionIndex = this.position.index;
				}

				let route = this.assignment.routes.getOne();

				// TODO: Implement route switching
				if (!route) {
					let newRoute = new Playbook.Models.EditorRoute(true);
					this.assignment.routes.add(newRoute);
					route = this.assignment.routes.get(newRoute.guid);
				}
				if (route.dragInitialized) {

					let coords = new Common.Models.Coordinates(
						this.graphics.location.ax + dx,
						this.graphics.location.ay + dy
					);

					route.initializeCurve(coords, e.shiftKey);
				}

				// prevent remaining logic from getting executed.
				return;

			} else if (!e.shiftKey && e.which != Common.Input.Which.RightClick) {

				// Update the placement to track for modification
				this.layer.moveByDelta(dx, dy);
				if(this.assignment) {
					// TODO: implement route switching
					this.assignment.routes.forEach(function(route: Common.Interfaces.IRoute, index: number) {
						if (Common.Utilities.isNotNullOrUndefined(route)) {
							route.layer.moveByDelta(dx, dy);
						}
					});
				}

				// Update relative coordinates label, if it exists
				if (this.relativeCoordinatesLabel) {
					let updatedRelativeCoordinates = [
						this.graphics.placement.relative.rx, ', ',
						this.graphics.placement.relative.ry
					].join('');
					this.relativeCoordinatesLabel.graphics.attrKeyValue('text', updatedRelativeCoordinates);
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
		}
		public dragEnd(e: any) {
			if(this.dragging) {
				this.drop();

				if (this.assignment) {
					// TODO: implement route switching
					this.assignment.routes.forEach(function(route: Common.Interfaces.IRoute, index: number) {
						if (Common.Utilities.isNotNullOrUndefined(route)) {
							if (route.dragInitialized) {
								route.dragInitialized = false;
							}
							route.drop();
							route.draw();
						}
					});
				}

				if (this.relativeCoordinatesLabel)
					this.relativeCoordinatesLabel.layer.hide();
			}

			super.dragEnd(e);
		}

		public clearRoute() {
		}

		public setRouteFromDefaults(routeTitle: string) {
		}

		public onkeypress() {
		}

		public getPositionRelativeToBall(): Common.Models.RelativeCoordinates {
			return this.graphics.placement.relative;
		}

		public getCoordinatesFromAbsolute(): Common.Models.Coordinates {
			return this.graphics.placement.coordinates;
		}

		public hasPlacement(): boolean {
			return this.graphics.placement != null;
		}
		public hasPosition(): boolean {
			return this.position != null;
		}
	}
}