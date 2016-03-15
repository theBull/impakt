/// <reference path='../../common/common.ts' />
/// <reference path='./interfaces/interfaces.ts' />

module Playbook { 

	export enum ImpaktTypes {
        Unknown = 0,
		PlaybookView = 1,
		Playbook = 2,
		PlayFormation = 3,
		PlaySet = 4,

		PlayTemplate = 98,
		Variant = 99,

		Play = 100,
		Player = 101,
		PlayPlayer = 102,
		PlayPosition = 103,
		PlayAssignment = 104,

		Team = 200
	}
	
	export module Editor { 

		export enum CanvasActions {
			FieldElementContextmenu,
			PlayerContextmenu,
			RouteNodeContextmenu,
			RouteTreeSelection
		}
		
		export class CursorTypes {
			static pointer = 'pointer';
			static crosshair = 'crosshair';
		}

		export enum PlaybookSetTypes {
			None,
			Personnel,
			Assignment
		}

		export enum UnitTypes {
			Offense,
			Defense,
			SpecialTeams,
			Other,
			Mixed
		}
		
		export enum EditorModes {
			None,
			Select,
			Formation,
			Assignment,
			Zoom
		}

		export enum EditorTypes {
			Formation,
			Assignment,
			Play,
			Set
		}
	}
}

module Icon {
	export class Glyphicon {
		prefix: string = 'glyphicon glyphicon-';
		icon: string = 'asterisk';
		get name(): string {
			return this.prefix + this.icon;
		}
		set name(n: string) {
			this.name = n;
		}

		constructor(icon?: string) {
			this.icon = icon || this.icon;
		}
	}
}








