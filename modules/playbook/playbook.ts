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

		export enum SetTypes {
			None,
			Personnel,
			Assignment,
			UnitType
		}

		export enum UnitTypes {
			Offense,
			Defense,
			SpecialTeams,
			Other
		}
		
		export enum ToolModes {
			None,
			Select,
			Formation,
			Assignment,
			Zoom
		}

		export enum EditorTypes {
			Formation,
			Assignment,
			Play
		}

		export enum PlayTypes {
			Any,
			Primary,
			Opponent
		}

		/**
		 * Allows the paper to be scaled/sized differently.
		 * To specify an initial paper size, for example,
		 * Paper is initialized with MaxCanvasWidth,
		 * which causes the paper to determine its width based
		 * on the current maximum width of its parent canvas. On the
		 * contrary, the paper can be told to set its width based
		 * on a given, target grid cell size. For example, if the target
		 * grid width is 20px and the grid is 50 cols, the resulting
		 * paper width will calculate to 1000px.
		 */
		export enum PaperSizingModes {
			TargetGridWidth,
			MaxCanvasWidth,
			PreviewWidth
		}
	}
}

module Playbook.Constants {
	export const FIELD_COLS_FULL = 52; 
	export const FIELD_ROWS_FULL = 120;
	export const FIELD_COLS_PREVIEW = 52;
	export const FIELD_ROWS_PREVIEW = 40;
	export const FIELD_COLOR = '#638148';
	export const GRID_SIZE = 15;
	export const GRID_BASE = 10;
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








