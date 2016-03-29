module Common.Interfaces {
	export interface IStorable {
		guid: string;
		toJson(): any;
		fromJson(json: any): any;
	}
}