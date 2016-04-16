/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface ILayerable
	extends Common.Interfaces.IStorable {

		layer: Common.Models.Layer;
		hasLayer(): boolean;

	}

}