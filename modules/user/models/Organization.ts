/// <reference path='./models.ts' />

module User.Models {
	export class Organization
	extends Common.Models.Storable {

		public companyName: string;
		public emailAccounting: string;
		public emailOther: string;
		public emailPrimary: string;
		public emailSales: string;
		public emailScheduling: string;
		public emailWarranty: string;
		public faxAccounting: string;
		public faxPrimary: string;
		public faxSales: string;
		public faxScheduling: string;
		public faxWarranty: string;
		public organizationKey: number;		
		public phoneAccounting: string;
		public phonePrimary: string;			
		public phoneSales: string; 			
		public phoneScheduling: string; 		
		public phoneWarranty: string; 			
		public primaryAddress1: string;		
		public primaryAddress2: string;		
		public primaryAddress3: string;		
		public primaryCity: string; 			
		public primaryCountry: string; 		
		public primaryPostalCode: string; 		
		public primaryStateProvince: string; 
		public secondaryAddress1: string; 		
		public secondaryAddress2: string; 		
		public secondaryAddress3: string; 		
		public secondaryCity: string; 			
		public secondaryCountry: string; 		
		public secondaryPostalCode: string; 
		public secondaryStateProvince: string;
		public upsFedExAddress1: string;	
		public upsFedExAddress2: string; 		
		public upsFedExAddress3: string; 		
		public upsFedExCity: string; 			
		public upsFedExCountry: string; 		
		public upsFedExPostalCode: string; 	
		public upsFedExStateProvince: string;
		public website: string;
		
		constructor() {
			super();

			this.companyName = null;
			this.emailAccounting = null;
			this.emailOther = null;
			this.emailPrimary = null;
			this.emailSales = null;
			this.emailScheduling = null;
			this.emailWarranty = null;
			this.faxAccounting = null;
			this.faxPrimary = null;
			this.faxSales = null;
			this.faxScheduling = null;
			this.faxWarranty = null;
			this.organizationKey = -1;
			this.phoneAccounting = null;
			this.phonePrimary = null;
			this.phoneSales = null;
			this.phoneScheduling = null;
			this.phoneWarranty = null;
			this.primaryAddress1 = null;
			this.primaryAddress2 = null;
			this.primaryAddress3 = null;
			this.primaryCity = null;
			this.primaryCountry = null;
			this.primaryPostalCode = null;
			this.primaryStateProvince = null;
			this.secondaryAddress1 = null;
			this.secondaryAddress2 = null;
			this.secondaryAddress3 = null;
			this.secondaryCity = null;
			this.secondaryCountry = null;
			this.secondaryPostalCode = null;
			this.secondaryStateProvince = null;
			this.upsFedExAddress1 = null;
			this.upsFedExAddress2 = null;
			this.upsFedExAddress3 = null;
			this.upsFedExCity = null;
			this.upsFedExCountry = null;
			this.upsFedExPostalCode = null;
			this.upsFedExStateProvince = null;
			this.website = null;
		}

		public toJson(): any {
			let json = {
				companyName: this.companyName,
				emailAccounting: this.emailAccounting,
				emailOther: this.emailOther,
				emailPrimary: this.emailPrimary,
				emailSales: this.emailSales,
				emailScheduling: this.emailScheduling,
				emailWarranty: this.emailWarranty,
				faxAccounting: this.faxAccounting,
				faxPrimary: this.faxPrimary,
				faxSales: this.faxSales,
				faxScheduling: this.faxScheduling,	
				faxWarranty: this.faxWarranty,
				organizationKey: this.organizationKey,	
				phoneAccounting: this.phoneAccounting, 			
				phonePrimary: this.phonePrimary,
				phoneSales: this.phoneSales,
				phoneScheduling: this.phoneScheduling,
				phoneWarranty: this.phoneWarranty,
				primaryAddress1: this.primaryAddress1,
				primaryAddress2: this.primaryAddress2,
				primaryAddress3: this.primaryAddress3,
				primaryCity: this.primaryCity,
				primaryCountry: this.primaryCountry,
				primaryPostalCode: this.primaryPostalCode,
				primaryStateProvince: this.primaryStateProvince,
				secondaryAddress1: this.secondaryAddress1,
				secondaryAddress2: this.secondaryAddress2,
				secondaryAddress3: this.secondaryAddress3,
				secondaryCity: this.secondaryCity,
				secondaryCountry: this.secondaryCountry,
				secondaryPostalCode: this.secondaryPostalCode,
				secondaryStateProvince: this.secondaryStateProvince,
				upsFedExAddress1: this.upsFedExAddress1, 			
				upsFedExAddress2: this.upsFedExAddress2,
				upsFedExAddress3: this.upsFedExAddress3, 			
				upsFedExCity: this.upsFedExCity, 				
				upsFedExCountry: this.upsFedExCountry, 			
				upsFedExPostalCode: this.upsFedExPostalCode, 		
				upsFedExStateProvince: this.upsFedExStateProvince,
				website: this.website 		
			};
			return json;
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.companyName 			= json.companyName;
			this.emailAccounting 		= json.emailAccounting;
			this.emailOther 			= json.emailOther;
			this.emailPrimary 			= json.emailPrimary;
			this.emailSales 			= json.emailSales;
			this.emailScheduling 		= json.emailScheduling;
			this.emailWarranty 			= json.emailWarranty;
			this.faxAccounting 			= json.faxAccounting;
			this.faxPrimary 			= json.faxPrimary;
			this.faxSales 				= json.faxSales;
			this.faxScheduling 			= json.faxScheduling;
			this.faxWarranty 			= json.faxWarranty;
			this.organizationKey 		= json.organizationKey;
			this.phoneAccounting 		= json.phoneAccounting;
			this.phonePrimary 			= json.phonePrimary;
			this.phoneSales 			= json.phoneSales;
			this.phoneScheduling 		= json.phoneScheduling;
			this.phoneWarranty 			= json.phoneWarranty;
			this.primaryAddress1 		= json.primaryAddress1;
			this.primaryAddress2 		= json.primaryAddress2;
			this.primaryAddress3 		= json.primaryAddress3;
			this.primaryCity 			= json.primaryCity;
			this.primaryCountry 		= json.primaryCountry;
			this.primaryPostalCode 		= json.primaryPostalCode;
			this.primaryStateProvince 	= json.primaryStateProvince;
			this.secondaryAddress1 		= json.secondaryAddress1;
			this.secondaryAddress2 		= json.secondaryAddress2;
			this.secondaryAddress3 		= json.secondaryAddress3;
			this.secondaryCity 			= json.secondaryCity;
			this.secondaryCountry 		= json.secondaryCountry;
			this.secondaryPostalCode 	= json.secondaryPostalCode;
			this.secondaryStateProvince = json.secondaryStateProvince;
			this.upsFedExAddress1 		= json.upsFedExAddress1;
			this.upsFedExAddress2 		= json.upsFedExAddress2;
			this.upsFedExAddress3 		= json.upsFedExAddress3;
			this.upsFedExCity 			= json.upsFedExCity;
			this.upsFedExCountry 		= json.upsFedExCountry;
			this.upsFedExPostalCode 	= json.upsFedExPostalCode;
			this.upsFedExStateProvince 	= json.upsFedExStateProvince;
			this.website 				= json.website;
		}

	}
}