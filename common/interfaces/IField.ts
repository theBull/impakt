/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IField
	extends Common.Interfaces.IModifiable {

		paper: Common.Interfaces.IPaper;
		grid: Common.Interfaces.IGrid;
		scenario: Common.Models.Scenario;
		ball: Common.Interfaces.IBall;
		primaryPlayers: Common.Models.PlayerCollection;
		opponentPlayers: Common.Models.PlayerCollection;
        ground: Common.Interfaces.IGround;
        los: Common.Interfaces.ILineOfScrimmage;
        endzone_top: Common.Interfaces.IEndzone;
        endzone_bottom: Common.Interfaces.IEndzone;
        sideline_left: Common.Interfaces.ISideline;
        sideline_right: Common.Interfaces.ISideline;
        hashmark_left: Common.Interfaces.IHashmark;
        hashmark_right: Common.Interfaces.IHashmark;
        hashmark_sideline_left: Common.Interfaces.IHashmark;
        hashmark_sideline_right: Common.Interfaces.IHashmark;
        selected: Common.Interfaces.ICollection<Common.Interfaces.IFieldElement>;
		cursorCoordinates: Common.Models.Coordinates;
		editorType: Playbook.Enums.EditorTypes;
		
		initialize(): void;
		draw(): void;
		drawScenario(): void;
		registerLayer(layer: Common.Models.Layer);
		addPrimaryPlayer(
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		): Common.Interfaces.IPlayer;
		addOpponentPlayer(
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		): Common.Interfaces.IPlayer;
		clearPrimaryPlayers(): void;
        clearOpponentPlayers(): void;
        clearScenario(): void;
        clearPrimaryPlay(): void;
        clearOpponentPlay(): void;
		clearPlayers(): void;
		updateScenario(scenario: Common.Models.Scenario): void;

		getSelectedByLayerType(layerType: Common.Enums.LayerTypes)
			: Common.Models.Collection<Common.Interfaces.IFieldElement>;
		toggleSelectionByLayerType(layerType: Common.Enums.LayerTypes): void
		toggleSelection(element: Common.Interfaces.IFieldElement): void;
		setSelection(element: Common.Interfaces.IFieldElement): void;
		deselectAll();

        useAssignmentTool(coords: Common.Models.Coordinates);
        setCursorCoordinates(pageX: number, pageY: number): void;
        getLOSAbsolute(): number;
	}
}