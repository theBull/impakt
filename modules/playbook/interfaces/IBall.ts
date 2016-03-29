/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	export interface IBall {

		canvas: Playbook.Interfaces.ICanvas;
		context: Playbook.Interfaces.IField;
		grid: Playbook.Interfaces.IGrid;
		placement: Playbook.Models.Placement;

		draw(): any;
		getRelativeCoordinates(coordinates: Playbook.Models.Coordinates): Playbook.Models.Coordinates;
		getCoordinatesRelativeTo(bx: number, by: number): Playbook.Models.Coordinates;
	}
}