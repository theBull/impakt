/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IContextual
	extends Common.Interfaces.IStorable {

		contextmenuTemplateUrl: string;
		getContextmenuUrl(): string;
		actions: Common.Models.ActionRegistry;
		
	}

}