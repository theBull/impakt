/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IHoverable
	extends Common.Interfaces.IActionable {
		
		hoverIn(e: any, context?: any): void;
		hoverOut(e: any, context?: any): void;

	}

}