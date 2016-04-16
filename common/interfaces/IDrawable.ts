/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IDrawable {
		ondraw(callback: Function): void;
		draw(): void;
	}
}