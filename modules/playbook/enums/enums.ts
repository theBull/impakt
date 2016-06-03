/// <reference path='../playbook.ts' />

module Playbook.Enums {

	export enum Actions {
		FieldElementContextmenu,
		PlayerContextmenu,
		RouteNodeContextmenu,
		RouteTreeSelection
	}

	export enum ToolModes {
		None,
		Select,
		Formation,
		Assignment,
		Zoom
	}

	export enum ToolActions {
		Nothing,
		Select,
		ToggleMenu,
		AddPlayer,
		Save,
		ZoomIn,
		ZoomOut,
		Assignment
	}

	export enum EditorTypes {
		Any,
		Formation,
		Assignment,
		Play,
		Scenario
	}

	export enum PlayTypes {
		Any,
		Primary,
		Opponent,
		Unknown
	}

    export enum PlayerIconTypes {
        CircleEditor,
        SquareEditor,        
        TriangleEditor,
        CirclePreview,
        SquarePreview,
        TrianglePreview
    }

    export enum Hashmark {
    	Left,
    	Center,
    	Right
    }
}