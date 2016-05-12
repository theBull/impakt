/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface ILinkedListNode<T>
	extends Common.Interfaces.IModifiable {

		next: T;
		prev: T;

	}
}