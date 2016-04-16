/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IModifiable
	extends Common.Interfaces.IStorable {

		callbacks: Function[];
		modified: boolean;
		checksum: string;
		original: string;
		lastModified: number;
		context: any;
		isContextSet: boolean;
		listening: boolean;

		copy(newElement: Common.Models.Modifiable, context: Common.Models.Modifiable): Common.Models.Modifiable;
		checkContextSet(): void;
		setContext(context: any): void;
		onModified(callback: Function): void;
		isModified(): void;
		setModified(isModified?: boolean): boolean;
		listen(startListening: boolean): any;
		clearListeners(): void;
		generateChecksum(): string;
	}
}