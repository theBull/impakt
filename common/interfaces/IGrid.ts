/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IGrid {
		
		paper: Common.Interfaces.IPaper;
		dimensions: Common.Models.Dimensions;
		size: number;
		cols: number;
		rows: number;
		divisor: number;
		snapping: boolean;

		draw(): void;
		setSnapping(snapping: boolean): void;
		toggleSnapping(): void;
		resize(sizingMode: Common.Enums.PaperSizingModes): number;
		getSize(): number;
		getWidth(): number;
		getHeight(): number;
		getCenter(): Common.Models.Coordinates;
		getAbsoluteFromCoordinate(val: number): number;
		getAbsoluteFromCoordinates(x: number, y: number): Common.Models.Coordinates;
		getCoordinatesFromAbsolute(ax: number, ay: number): Common.Models.Coordinates;
		snapPixel(pixel: number): number;
		isDivisible(value: number): boolean;
		getCursorOffset(pageX: number, pageY: number): Common.Models.Coordinates;
		getCursorPositionAbsolute(pageX: number, pageY: number): Common.Models.Coordinates;
		getCursorPositionCoordinates(pageX: number, pageY: number): Common.Models.Coordinates;

	}
}