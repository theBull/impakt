/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IPlayer 
	extends Common.Interfaces.IFieldElement {
		
		ball: Common.Interfaces.IBall;
		assignment: Common.Models.Assignment;
		position: Team.Models.Position;
		icon: Common.Interfaces.IPlayerIcon;
		selectionBox: Common.Interfaces.IPlayerSelectionBox;	
		relativeCoordinatesLabel: Common.Interfaces.IPlayerRelativeCoordinatesLabel;
		personnelLabel: Common.Interfaces.IPlayerPersonnelLabel;
		indexLabel: any;
		renderType: Common.Enums.RenderTypes;
		unitType: Team.Enums.UnitTypes;

		flip(): void;
	}

}