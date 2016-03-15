/// <reference path='./models.ts' />

module User.Models {
	export class AccountUser
	extends Common.Models.Storable {

		constructor() {
			super();
		}

		public toJson(): any {
			return {}
		}

		public fromJson() {

		}

	}


}