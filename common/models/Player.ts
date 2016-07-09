/// <reference path='./models.ts' />

module Common.Models {

	// @todo treat Player as a FieldElementSet
	export abstract class Player
	extends Common.Models.FieldElement {

		/**
		 *
		 * Data structures
		 * 
		 */
		public position: Team.Models.Position;
		public assignment: Common.Models.Assignment;
		public placement: Common.Models.Placement;
		public renderType: Common.Enums.RenderTypes;
		public unitType: Team.Enums.UnitTypes;

		/**
		 * 
		 * Graphics layers
		 * 
		 */
		public layer: Common.Models.Layer;
		public icon: Common.Interfaces.IPlayerIcon;
		public selectionBox: Common.Interfaces.IPlayerSelectionBox;
		public relativeCoordinatesLabel: Common.Interfaces.IPlayerRelativeCoordinatesLabel;
		public personnelLabel: Common.Interfaces.IPlayerPersonnelLabel;
		public indexLabel: any;

		constructor(
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		) {
			super();
			this.placement = placement;
			this.position = position;
			this.unitType = this.position ? this.position.unitType : Team.Enums.UnitTypes.Other;
			this.assignment = assignment || new Common.Models.Assignment(this.unitType);
			this.flippable = true;
			
			if (Common.Utilities.isNotNullOrUndefined(this.assignment) &&
				Common.Utilities.isNotNullOrUndefined(this.position)) {
				this.assignment.positionIndex = this.position.index;
			}
		}

		public initialize(field: Common.Interfaces.IField): void {
			super.initialize(field, field.ball);

			this.layer.type = Common.Enums.LayerTypes.Player;
			//this.graphics.setPlacement(this.placement);
			this.graphics.initializePlacement(this.placement);
			this.placement.setRelativeElement(this.field.ball);
			this.graphics.dimensions.setWidth(this.grid.getSize());
			this.graphics.dimensions.setHeight(this.grid.getSize());

			this.layer.addLayer(this.assignment.layer);

			let self = this;
			this.layer.onModified(function() {
				self.setModified(true);
			});

			this.field.layer.addLayer(this.layer);
		}

		public flip(): void {
			this.layer.flip();
			if (Common.Utilities.isNotNullOrUndefined(this.assignment)) {
				this.assignment.flip();
			}
			this.flipped = !this.flipped;
		}

		public remove(): void {
			this.layer.remove();
		}

		public drop(): void {
			super.drop();
			if(Common.Utilities.isNotNullOrUndefined(this.assignment)) {
				this.assignment.drop();
			}
		}

		public abstract draw(): void;

		public getPositionRelativeToBall(): Common.Models.RelativeCoordinates {
			return this.graphics.placement.relative;
		}
		public getCoordinatesFromAbsolute(): Common.Models.Coordinates {
			return this.graphics.placement.coordinates;
		}

		/**
		 *
		 * Assignment
		 * 
		 */
		public hasAssignment(): boolean {
			return Common.Utilities.isNullOrUndefined(this.assignment);
		}
		public getAssignment(): Common.Models.Assignment {
			return this.assignment;
		}
		public setAssignment(assignment: Common.Models.Assignment): void {
			if(Common.Utilities.isNotNullOrUndefined(this.assignment)) {
				this.layer.removeLayer(this.assignment.layer);
			}

			this.assignment = assignment;
			this.layer.addLayer(this.assignment.layer);
		}

		/**
		 * 
		 * Position
		 * 
		 */
		public hasPosition(): boolean {
			return Common.Utilities.isNullOrUndefined(this.position);
		}
		public getPosition(): Team.Models.Position {
			return this.position;
		}
		public setPosition(position: Team.Models.Position): void {
			this.position = position;
			this.setModified(true);
		}

		/**
		 * 
		 * Placement
		 * 
		 */
		public hasPlacement(): boolean {
			return Common.Utilities.isNullOrUndefined(this.graphics.placement);
		}
		public getPlacement(): Common.Models.Placement {
			return this.graphics.placement;
		}
		public setPlacement(placement: Common.Models.Placement): void {
			this.graphics.initializePlacement(placement);
			this.assignment.refresh();
			this.setModified(true);
		}

	}
}