/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {

	export interface IListener {
		listen(actionId: Playbook.Editor.CanvasActions, fn: any): void;
		invoke(actionId: Playbook.Editor.CanvasActions, data: any, context: any): void;
	}
}

