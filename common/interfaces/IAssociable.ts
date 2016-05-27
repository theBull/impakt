/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IAssociable
	extends Common.Interfaces.IModifiable {
		
		key: number;
		impaktDataType: Common.Enums.ImpaktDataTypes;
		guid: string;
		associationKey: string;
		name: string;
		
	}
}