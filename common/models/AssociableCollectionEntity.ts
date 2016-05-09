/// <reference path='./models.ts' />

module Common.Models {
	export abstract class AssociableCollectionEntity<T extends Common.Models.AssociableEntity>
	extends Common.Models.ModifiableCollection<T> {

		private _associableEntity: Common.Models.AssociableEntity;

		constructor(
			impaktDataType: Common.Enums.ImpaktDataTypes
		) {
			super();
			this._associableEntity = new Common.Models.AssociableEntity(impaktDataType);
		}

		public toJson(): any {
			return $.extend(
				this._associableEntity.toJson(), 
				super.toJson()
			);
		}

		public fromJson(json: any): void {
			if (!json)
				throw new Error('AssociableEntity fromJson(): json is null or undefined');

			this._associableEntity.fromJson(json);
			super.fromJson(json);
		}

	}
}