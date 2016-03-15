/// <reference path='../models.ts' />

module Playbook.Models {
	export class PlaybookData
	extends Common.Models.Modifiable {

		public types: Playbook.Models.UnitTypeCollection;
		private _hasTypes: boolean;
		public isPrivate: boolean;

		constructor() {
			super(this);
			this.types = new Playbook.Models.UnitTypeCollection();
			this.isPrivate = true;
			this._hasTypes = true;
		}

		public toJson(): any {
			return {
				isPrivate: this.isPrivate,
				types: this.types.toJson()
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;
		}
	}
}