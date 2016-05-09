/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IAssociable {
		
		key: number;
		impaktDataType: Common.Enums.ImpaktDataTypes;
		guid: string;
		associationKey: string;
		
	}
}