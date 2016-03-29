/// <reference path='./interfaces.ts' />
/// <reference path='../models/models.ts' />

module Playbook.Interfaces {

	export interface ICanvas {
		paper: Playbook.Interfaces.IPaper;

		container: HTMLElement; // HTML parent container
		$container: any; // jquery
		exportCanvas: HTMLCanvasElement; // HTML <canvas/> element for rendering
		$exportCanvas: any; // jquery

		playPrimary: Playbook.Models.PlayPrimary;
		playOpponent: Playbook.Models.PlayOpponent; 
		toolMode: Playbook.Editor.ToolModes;
		width: number;
		height: number;

		exportToPng(): string;
	}
}

