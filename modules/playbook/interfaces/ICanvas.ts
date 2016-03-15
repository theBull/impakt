/// <reference path='./interfaces.ts' />
/// <reference path='../models/models.ts' />

module Playbook.Interfaces {

	export interface ICanvas {
		container: HTMLElement;
		$container: any; // jquery element
		paper: any;
		grid: Playbook.Models.Grid;
		center: Playbook.Models.Coordinate;
		width: number;
		height: number;
	}
}

