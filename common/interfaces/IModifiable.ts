module Common.Interfaces {
	export interface IModifiable {
		onModified(callback: Function): void;
		isModified(): void;
		setModified(): boolean;
	}
}