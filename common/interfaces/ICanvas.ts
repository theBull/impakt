/// <reference path='./interfaces.ts' />
/// <reference path='../models/models.ts' />

module Common.Interfaces {

	export interface ICanvas {

		field: Common.Interfaces.IField;
		grid: Common.Interfaces.IGrid;
		drawing: Common.Drawing.Utilities;
		sizingMode: Common.Enums.CanvasSizingModes;
		$container: any;
		container: HTMLElement;
		$exportCanvas: any;
		exportCanvas: HTMLCanvasElement;
		tab: Common.Models.Tab;
		dimensions: Common.Models.Dimensions;
		x: number;
		y: number;
		listener: Common.Models.CanvasListener;
		readyCallbacks: Function[];
		widthChangeInterval: any;
		active: boolean;
		editorType: Playbook.Enums.EditorTypes;
        toolMode: Playbook.Enums.ToolModes;
        state: Common.Enums.State;

		exportToPng(): string;
		setDimensions(): void;
		clear(): void;
		getWidth(): number;
		getHeight(): number;
	}
}