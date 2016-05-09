/// <reference path='./models.ts' />

module User.Models {
	export class Organization
	extends Common.Models.Storable {

		public accountKey: number; 
		public address1: string;
		public address2: string;
		public address3: string;
		public city: string;
		public country: string;
		public faxPrimary: string;
		public inactive: boolean;
		public name: string;
		public notes: any;
		public organizationKey: number;
		public otherDetails: any;
		public phonePrimary: string;
		public postalCode: string;
		public primaryEmail: string;
		public stateProvince: string;
		
		constructor() {
			super();

			this.accountKey = 0;
			this.address1 = null;
			this.address2 = null;
			this.address3 = null;
			this.city = null;
			this.country = null;
			this.faxPrimary = null;
			this.inactive = false;
			this.name = null;
			this.notes = null;
			this.organizationKey = 0;
			this.otherDetails = null;
			this.phonePrimary = null;
			this.postalCode = null;
			this.primaryEmail = null;
			this.stateProvince = null;
		}

		public toJson(): any {
			return {
				accountKey: this.accountKey,
				address1: this.address1,
				address2: this.address2,
				address3: this.address3,
				city: this.city,
				country: this.country,
				faxPrimary: this.faxPrimary,
				inactive: this.inactive,
				name: this.name,
				notes: this.notes,
				organizationKey: this.organizationKey,
				otherDetails: this.otherDetails,
				phonePrimary: this.phonePrimary,
				postalCode: this.postalCode,
				primaryEmail: this.primaryEmail,
				stateProvince: this.stateProvince
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.accountKey = json.accountKey;
			this.address1 = json.address1;
			this.address2 = json.address2;
			this.address3 = json.address3;
			this.city = json.city;
			this.country = json.country;
			this.faxPrimary = json.faxPrimary;
			this.inactive = json.inactive;
			this.name = json.name;
			this.notes = json.notes;
			this.organizationKey = json.organizationKey;
			this.otherDetails = json.otherDetails;
			this.phonePrimary = json.phonePrimary;
			this.postalCode = json.postalCode;
			this.primaryEmail = json.primaryEmail;
			this.stateProvince = json.stateProvince;
		}

	}
}