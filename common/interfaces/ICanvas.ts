/// <reference path='./interfaces.ts' />
/// <reference path='../models/models.ts' />

module Common.Interfaces {

	export interface ICanvas {
		paper: Common.Interfaces.IPaper;
		container: HTMLElement; // HTML parent container
		$container: any; // jquery
		exportCanvas: HTMLCanvasElement; // HTML <canvas/> element for rendering
		$exportCanvas: any; // jquery
		dimensions: Common.Models.Dimensions;
		toolMode: Playbook.Enums.ToolModes;
		unitType: Team.Enums.UnitTypes;
        editorType: Playbook.Enums.EditorTypes;
        tab: Common.Models.Tab;
        scrollable: any;
        playPrimary: Common.Models.PlayPrimary;
        playOpponent: Common.Models.PlayOpponent;
        listener: Common.Models.CanvasListener;

		exportToPng(): string;
		setDimensions(): void;
	}
}

