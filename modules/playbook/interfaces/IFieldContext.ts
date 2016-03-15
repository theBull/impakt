/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	export interface IFieldContext {
		context: Playbook.Interfaces.IFieldContext;
		grid: Playbook.Models.Grid;
		field: Playbook.Models.Field;
		paper: Playbook.Models.Paper;
	}
}