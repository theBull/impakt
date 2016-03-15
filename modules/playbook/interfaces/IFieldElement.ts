/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	export interface IFieldElement {

		context: Playbook.Interfaces.IField | 
			Playbook.Interfaces.IFieldElement | 
			Playbook.Interfaces.IRoute;
		paper: Playbook.Interfaces.IPaper;
		grid: Playbook.Interfaces.IGrid;
		field: Playbook.Interfaces.IField;

		draw(): void;
	}
}