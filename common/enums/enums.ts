/// <reference path='../common.ts' />

module Common.Enums {

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

	export enum DimensionTypes {
		Square,
		Circle,
		Ellipse
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

	export enum LayerTypes {
		Generic,
		FieldElement,
		Player,
		PlayerIcon,
		PlayerPersonnelLabel,
		PlayerIndexLabel,
		PlayerCoordinates,
		PlayerRelativeCoordinatesLabel,
		PlayerSelectionBox,
		PlayerRoute,
		PlayerSecondaryRoutes,
		PlayerAlternateRoutes,
		PlayerRouteAction,
		PlayerRouteNode,
		PlayerRoutePath,
		PlayerRouteControlPath,

		PrimaryPlayer,
		PrimaryPlayerIcon,
		PrimaryPlayerLabel,
		PrimaryPlayerCoordinates,
		PrimaryPlayerRelativeCoordinatesLabel,
		PrimaryPlayerSelectionBox,
		PrimaryPlayerRoute,
		PrimaryPlayerSecondaryRoutes,
		PrimaryPlayerAlternateRoutes,
		PrimaryPlayerRouteAction,
		PrimaryPlayerRouteNode,
		PrimaryPlayerRoutePath,
		PrimaryPlayerRouteControlPath,

		OpponentPlayer,
		OpponentPlayerIcon,
		OpponentPlayerLabel,
		OpponentPlayerCoordinates,
		OpponentPlayerRelativeCoordinatesLabel,
		OpponentPlayerSelectionBox,
		OpponentPlayerRoute,
		OpponentPlayerSecondaryRoutes,
		OpponentPlayerAlternateRoutes,
		OpponentPlayerRouteAction,
		OpponentPlayerRouteNode,
		OpponentPlayerRoutePath,
		OpponentPlayerRouteControlPath,

		Ball,
		Field,
		Sideline,
		Hashmark,
		SidelineHashmark,
		Endzone,
		LineOfScrimmage
	}

	export enum RouteTypes {
        None,
        Generic,
        Block,
        Scan,
        Run,
        Route,
        Cover,
        Zone,
        Spy,
        Option,
        HandOff,
        Pitch,
        Preview
    }

	export enum RouteNodeTypes {
        None,
        Normal,
        Root,
        CurveStart,
        CurveControl,
        CurveEnd,
        End
    }

    export enum RouteNodeActions {
        None,
        Block,
        Delay,
        Continue,
        Juke,
        ZigZag
    }
}