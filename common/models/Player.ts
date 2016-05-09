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
			field: Common.Interfaces.IField,
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		) {
			super(field, field.ball);

			this.layer.type = Common.Enums.LayerTypes.Player;
			this.layer.graphics.setPlacement(placement);
			this.position = position;
			this.assignment = assignment || new Common.Models.Assignment(this.position.unitType);
			this.assignment.positionIndex = this.position.index;

			this.layer.graphics.dimensions.setWidth(this.grid.getSize());
			this.layer.graphics.dimensions.setHeight(this.grid.getSize());

			let self = this;
			this.onModified(function() {
				self.field.players.setModified(true);
			});
			this.layer.onModified(function() {
				self.setModified(true);
			});
		}

		public remove(): void {
			this.layer.remove();
		}

		public abstract draw(): void;

		public getPositionRelativeToBall(): Common.Models.RelativeCoordinates {
			return this.layer.graphics.placement.relative;
		}
		public getCoordinatesFromAbsolute(): Common.Models.Coordinates {
			return this.layer.graphics.placement.coordinates;
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
			this.assignment = assignment;
			this.setModified(true);
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
			return Common.Utilities.isNullOrUndefined(this.layer.graphics.placement);
		}
		public getPlacement(): Common.Models.Placement {
			return this.layer.graphics.placement;
		}
		public setPlacement(placement: Common.Models.Placement): void {
			this.layer.graphics.updateFromCoordinates(placement.coordinates.x, placement.coordinates.y);
			this.setModified(true);

			let self = this;
			this.layer.layers.forEach(function(layer: Common.Models.Layer, index: number) {
				layer.graphics.setPlacement(placement);
			});
		}
	}
}