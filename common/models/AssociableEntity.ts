/// <reference path='./models.ts' />

module Common.Models {
	
	export class AssociableEntity
	extends Common.Models.Actionable
	implements Common.Interfaces.IAssociable {

		public key: number;
		public impaktDataType: Common.Enums.ImpaktDataTypes;
		public associationKey: string;

		constructor(
			impaktDataType: Common.Enums.ImpaktDataTypes
		) {
			super(impaktDataType);

			this.key = 0;
			this.impaktDataType = impaktDataType;
			this.associationKey = null;
		}

		public generateAssociationKey() {
			this.associationKey = [
				this.impaktDataType,
				'|',
				this.key,
				'|',
				this.guid
			].join('');
		}

		public toJson(): any {
			return $.extend({
				key: this.key,
				impaktDataType: this.impaktDataType,
				associationKey: this.associationKey
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				throw new Error('AssociableEntity fromJson(): json is null or undefined');

			this.key = json.key;
			this.impaktDataType = json.impaktDataType;
			
			super.fromJson(json);

			if (Common.Utilities.isNullOrUndefined(json.associationKey)) {
				this.generateAssociationKey();
			} else {
				this.associationKey = json.associationKey
			}
		}

	}
}