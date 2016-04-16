/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IGround
	extends Common.Interfaces.IFieldElement {
		getClickCoordinates(offsetX: number, offsetY: number): Common.Models.Coordinates;
	}
}