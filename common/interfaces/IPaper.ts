/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IPaper {

		canvas: Common.Interfaces.ICanvas;
		field: Common.Interfaces.IField;
		grid: Common.Interfaces.IGrid;
		sizingMode: Common.Enums.PaperSizingModes;
		drawing: Common.Drawing.Utilities;
		x: number;
		y: number;
		zoomSpeed: number;
		showBorder: boolean;
		viewOutline: any;

		getWidth(): number;
		getHeight(): number;
		initialize(): void;
		draw(): void;
		drawOutline(): void;
		clear(): void;
		resize(): void;
		setViewBox(): void;
		scroll(scrollToX: number, scrollToY: number, center?: boolean): void;
		updatePlay(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent);
	}
}