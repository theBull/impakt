/// <reference path='../models.ts' />

module Playbook.Models {
	export class CanvasListener {

		public actions: any;
		
		constructor(context: Playbook.Models.Canvas) {
			//super(context);
			this.actions = {};
		}

		public listen(actionId: Playbook.Editor.CanvasActions, fn: any) {
			if(!this.actions.hasOwnProperty[actionId])
				this.actions[actionId] = [];

			this.actions[actionId].push(fn);
		}

		public invoke(actionId: Playbook.Editor.CanvasActions, data: any, context: any) {
			if(!this.actions[actionId]) return;
			
			for(var i = 0; i < this.actions[actionId].length; i++) {
				this.actions[actionId][i](data, context);
			}	
		}
		
	}
}