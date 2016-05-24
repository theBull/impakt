/// <reference path='./models.ts' />

module Common.Models {
	export class Tab extends Common.Models.Modifiable
	implements Common.Interfaces.ICollectionItem {

		public title: string = 'Untitled';
		public key: number;
		public active: boolean = true;
		public scenario: Common.Models.Scenario;
		public canvas: Common.Models.Canvas;

		private _closeCallbacks: Array<Function>;

		constructor(
			scenario: Common.Models.Scenario
		) {
			super();
			super.setContext(this);
			
			if (Common.Utilities.isNullOrUndefined(scenario))
				throw new Error('Tab constructor(): scenario is null or undefined');

			this.scenario = scenario;
			
			switch(this.scenario.editorType) {
				case Playbook.Enums.EditorTypes.Formation: 
					if (Common.Utilities.isNullOrUndefined(this.scenario.playPrimary) ||
						Common.Utilities.isNullOrUndefined(this.scenario.playPrimary.formation))
						throw new Error('Tab constructor(): scenario formation is null or undefined');
					this.title = this.scenario.playPrimary.formation.name;
					break;
				case Playbook.Enums.EditorTypes.Play:
					if (Common.Utilities.isNullOrUndefined(this.scenario.playPrimary))
						throw new Error('Tab constructor(): scenario primary play is null or undefined');
					this.title = this.scenario.playPrimary.name;
					break;
				case Playbook.Enums.EditorTypes.Scenario:
					this.title = this.scenario.name;
					break;
			}

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