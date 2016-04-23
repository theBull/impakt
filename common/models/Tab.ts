/// <reference path='./models.ts' />

module Common.Models {
	export class Tab extends Common.Models.Storable
	implements Common.Interfaces.ICollectionItem {

		public title: string = 'Untitled';
		public key: number;
		public active: boolean = true;
		public playPrimary: Common.Models.PlayPrimary;
		public playOpponent: Common.Models.PlayOpponent;
		public editorType: Playbook.Enums.EditorTypes;
		public unitType: Team.Enums.UnitTypes;
		public canvas: Common.Models.Canvas;

		private _closeCallbacks: Array<Function>;

		constructor(
			playPrimary: Common.Models.PlayPrimary,
			playOpponent: Common.Models.PlayOpponent
		) {
			super();
			this.playPrimary = playPrimary;
			this.editorType = this.playPrimary.editorType;
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