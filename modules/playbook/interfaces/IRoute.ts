/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	export interface IRoute {

		player: Playbook.Interfaces.IPlayer;
		paper: Playbook.Interfaces.IPaper;
		grid: Playbook.Interfaces.IGrid;
		field: Playbook.Interfaces.IField;

		draw(): void;
	}
}