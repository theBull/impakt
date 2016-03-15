/// <reference path='../models.ts' />

module Playbook.Models {
	export class Listener {

		public actions: any;

		constructor(context: any) {
			this.actions = {};
		}

		public listen(actionId: any, fn: any) {
			if(!this.actions.hasOwnProperty[actionId])
				this.actions[actionId] = [];

			this.actions[actionId].push(fn);
		}

		public invoke(actionId: any, data: any, context: any) {
			if(!this.actions[actionId]) return;
			
			for(var i = 0; i < this.actions[actionId].length; i++) {
				this.actions[actionId][i](data, context);
			}	
		}

	}
}