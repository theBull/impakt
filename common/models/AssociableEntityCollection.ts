/// <reference path='./models.ts' />

module Common.Models {
	export abstract class AssociableEntityCollection<T extends Common.Interfaces.IAssociable>
	extends Common.Models.Collection<T> {

		protected _associableEntity: Common.Models.AssociableEntity;

		constructor(
			impaktDataType: Common.Enums.ImpaktDataTypes,
			size?: number
		) {
			super(size);
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