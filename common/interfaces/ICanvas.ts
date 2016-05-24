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
        tab: Common.Models.Tab;
        scrollable: any;
        scenario: Common.Models.Scenario;
        listener: Common.Models.CanvasListener;

		exportToPng(): string;
		setDimensions(): void;
		clear(): void;
	}
}

