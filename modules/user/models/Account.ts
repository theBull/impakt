/// <reference path='./models.ts' />

module User.Models {
	export class Account 
	extends Common.Models.Storable {

		public name: string;
		public organizationKey: number;

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				Name: this.name,
				OrganizationKey: this.organizationKey
			}
		}

		public fromJson(json: any) {
			this.name = json.name;
			this.organizationKey = json.organizationKey;
		}

	}
}