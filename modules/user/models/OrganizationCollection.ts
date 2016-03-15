/// <reference path='./models.ts' />

module User.Models {

	export class OrganizationCollection
	extends Common.Models.Collection<User.Models.Organization> 
	{

		constructor() {
			super();
		}

		public toJson(): any {
			return super.toJson();
		}

		public fromJson(json: any) {
			if (!json)
				return;
			throw new Error('OrganizationCollection fromJson(): not implemented');
		}
	}
}