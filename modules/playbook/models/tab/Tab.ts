/// <reference path='../models.ts' />

module Playbook.Models {
	export class Tab
	implements Common.Interfaces.ICollectionItem {

		public title: string = 'Untitled';
		public guid: string = Common.Utilities.guid();
		public key: number;
		public active: boolean = true;
		public playPrimary: Playbook.Models.PlayPrimary;
		public playOpponent: Playbook.Models.PlayOpponent;
		public unitType: Playbook.Editor.UnitTypes;
		public canvas: Playbook.Models.Canvas;

		private _closeCallbacks: Array<Function>;

		constructor(
			playPrimary: Playbook.Models.PlayPrimary,
			playOpponent: Playbook.Models.PlayOpponent
		) {
			this.playPrimary = playPrimary;
			this.key = this.playPrimary.key;
			this.unitType = this.playPrimary.unitType;
			this.title = this.playPrimary.name;

			this._closeCallbacks = [function() {
				console.log('tab closed', this.guid);
			}];
		}

		public onclose(callback: Function): void {
			this._closeCallbacks.push(callback);
		}

		public close(): void {
			for(var i = 0; i < this._closeCallbacks.length; i++) {
				this._closeCallbacks[i]();
			}
		}
	}
}