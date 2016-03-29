/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	export interface IField {

		paper: Playbook.Interfaces.IPaper;
		grid: Playbook.Interfaces.IGrid;
		playPrimary: Playbook.Models.PlayPrimary;
		playOpponent: Playbook.Models.PlayOpponent;
		ball: Playbook.Models.Ball;
		players: Playbook.Models.PlayerCollection;

		draw(): void;
		
		addPlayer(
			placement: Playbook.Models.Placement,
			position: Playbook.Models.Position,
			assignment: Playbook.Models.Assignment
		): Playbook.Interfaces.IPlayer;
		togglePlayerSelection(player: Playbook.Models.Player): void;
		deselectAll(): void;
		useAssignmentTool(coords: Playbook.Models.Coordinates): void;
		updatePlay(playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent): void;

	}
}