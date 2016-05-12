/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IRoutePath
	extends Common.Interfaces.IFieldElement {
		pathString: string;

		draw(): void;
		remove(): void;
	}
}