/// <reference path='./models.ts' />

module Common.Models {
	export class NotImplementedClass
	extends Common.Models.Storable {

		public toJson(): any {
			return $.extend({
				data: 'Data not yet supported.'
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
		}
	}
}