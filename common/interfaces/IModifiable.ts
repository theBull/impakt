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
		listeners: any;

		copy(newElement: Common.Interfaces.IModifiable, context: Common.Interfaces.IModifiable): Common.Interfaces.IModifiable;
		checkContextSet(): void;
		setContext(context: any): void;
		onModified(callback: Function): void;
		isModified(): void;
		setModified(isModified?: boolean): boolean;
		listen(startListening: boolean): any;
		setListener(actionId: string, callback: Function): void;
		hasListeners(): boolean;
		clearListeners(): void;
		invokeListener(actionId: string, data?: any): void;
		generateChecksum(): string;
	}
}