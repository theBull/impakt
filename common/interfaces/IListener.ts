/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {

	export interface IListener {
		listen(actionId: Playbook.Enums.Actions, fn: any): void;
		invoke(actionId: Playbook.Enums.Actions, data: any, context: any): void;
	}
}

