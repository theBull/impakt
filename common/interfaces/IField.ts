/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IField
	extends Common.Interfaces.IModifiable {

		paper: Common.Interfaces.IPaper;
		grid: Common.Interfaces.IGrid;
		playPrimary: Common.Models.PlayPrimary;
		playOpponent: Common.Models.PlayOpponent;
		ball: Common.Interfaces.IBall;
		players: Common.Models.PlayerCollection;
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
        selected: Common.Models.ModifiableCollection<Common.Interfaces.IFieldElement>;
		cursorCoordinates: Common.Models.Coordinates;
		
		initialize(): void;
		draw(): void;
			registerLayer(layer: Common.Models.Layer);
		
		addPlayer(
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		): Common.Interfaces.IPlayer;
		clearPlay(): void;
		clearPlayers(): void;
		updatePlay(
			playPrimary: Common.Models.PlayPrimary, 
			playOpponent: Common.Models.PlayOpponent
		): void;

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