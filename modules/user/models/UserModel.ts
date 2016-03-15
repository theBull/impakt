/// <reference path='./models.ts' />

module User.Models {
	export class UserModel 
	extends Common.Models.Storable {

		public firstName: string;
		public lastName: string;
		public organizationName: number;
		public organizationKey: number;
		public invitationType: number;
		public invitationKey: number;
		public email: string;
		public recaptchaChallenge: string;
		public recaptchaResponse: string;

		constructor() {
			super();

			this.firstName = null;
			this.lastName = null;
			this.organizationKey = 0;
			this.organizationName = null;
			this.invitationType = 1;
			this.invitationKey = 0;
			this.email = null;
			this.recaptchaChallenge = '';
			this.recaptchaResponse = '';
		}

		public toJson(): any {
			return {
				FirstName: this.firstName,
				LastName: this.lastName,
				OrganizationName: this.organizationName,
				OrganizationKey: this.organizationKey,
				InvitationType: this.invitationType,
				InvitationKey: this.invitationKey,
				Email: this.email,
				RecaptchaChallenge: this.recaptchaChallenge,
				RecaptchaResponse: this.recaptchaResponse
			}
		}

		public fromJson(json: any) {
			this.firstName = json.FirstName;
			this.lastName = json.LastName;
			this.organizationName = json.OrganizationName;
			this.email = json.Email;
		}

	}
}