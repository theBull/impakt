/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IHoverable {
		hoverable: boolean;
		hoverIn(e: any, context?: any): void;
		hoverOut(e: any, context?: any): void;
	}

}