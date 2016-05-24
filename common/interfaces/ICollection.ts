/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface ICollection<T extends Common.Interfaces.IModifiable> {
		size(): number;
		isEmpty(): boolean;
		hasElements(): boolean;
		get(key: string | number): T;
		exists(key: string | number): boolean;
		first(): T;
		getOne(): T;
		getIndex(index: number): T;
		getAll(): { any ?: T };
		getLast(): T;
		set(key: string | number, data: T): void;
		replace(replaceKey: string | number, data: T): void;
		setAtIndex(index: number, data: T): void;
		add(data: T): void;
		addAll(elements: T[]): void;
		addAtIndex(data: T, index: number): void;
		only(data: T): void;
		append(collection: Common.Interfaces.ICollection<T>): void;
		forEach(iterator: Function): void;
		hasElementWhich(predicate: Function): boolean;
		filter(predicate: Function): T[];
		filterFirst(predicate: Function): T;
		empty(): void;
		removeAll(): void;
		removeEach(iterator): void;
		contains(key: string | number): boolean;
		toArray(): T[];
		toJson(): any[];
		getGuids(): Array<string | number>;
	}
}