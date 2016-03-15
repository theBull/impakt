/// <reference path='../models.ts' />

module Playbook.Models {
	export class Tab
	implements Common.Interfaces.ICollectionItem {

		public title: string = 'Untitled';
		public guid: string = Common.Utilities.guid();
		public key: number;
		public active: boolean = true;
		public play: Playbook.Models.Play;
		public type: Playbook.Editor.UnitTypes;
		public editorType: Playbook.Editor.EditorTypes;
		public canvas: Playbook.Models.Canvas;

		constructor(play: Playbook.Models.Play) {
			this.play = play;
			this.key = play.key;
			this.type = play.type;
			this.editorType = play.editorType;
			this.title = play.name;
		}
	}
}