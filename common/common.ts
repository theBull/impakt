/// <reference path='../js/impakt.ts' />

module Common {
	export module Base {
		export class Component {

			public type: ComponentType;
			public name: string;
			public guid: string;
			public waitingOn: string[];
			public dependencies: ComponentMap;
			public parent: Component;
			public loaded: boolean;
			private onReadyCallback: Function;
			
			constructor(name: string, type: ComponentType, waitingOn?: string[]) {
				this.name = name;
				this.type = type;
				this.guid = Common.Utilities.guid();
				this.waitingOn = waitingOn || [];
				this.loaded = this.waitingOn && this.waitingOn.length == 0;
				this.dependencies = new ComponentMap();

				this.onReadyCallback = function() {
					//console.log('Component ready', this);
				}
			}

			public ready(): void {
				//console.log('component ready', this);
				this.loaded = true;
				this.onReadyCallback(this);
			}

			public onready(callback): void {
				this.onReadyCallback = callback;

				// even when attaching the ready event listener,
				// if the component has no dependencies, and hence loaded,
				// fire off the ready callback
				if (this.loaded)
					this.ready();
			}

			public loadDependency(dependency: Common.Base.Component): void {
				//console.log('loading dependency', dependency, this);

				this.dependencies.add(dependency);
				let index = this.waitingOn.indexOf(dependency.name);
				this.waitingOn.splice(index, 1);

				if (dependency.loaded)
					dependency.ready();

				if(this.waitingOn.length == 0) {
					this.ready();
				}
			}

			public registerDependencies(): void {
				for (var i = 0; i < this.waitingOn.length; i++) {
					this.dependencies.add(
						new Component(
							this.waitingOn[i], 
							Common.Base.ComponentType.Null
						)
					);
				}
			}

		}
		export enum ComponentType {
			Null,
			Service,
			Controller,
			Directive
		}
		export class ComponentMap {
			public count: number;
			public obj: any;

			constructor() {
				this.obj = {};
				this.count = 0;
			}

			/**
			 * Adds a new component to the list or updates
			 * the component if it already exists.
			 * @param {Component} component The component to be added
			 */
			public add(component: Component): void {
				if(this.obj[component.guid]) {
					this.set(component);
					return;
				}

				this.obj[component.guid] = component;
				this.count++;
			}
			public remove(guid: string): Component {
				let component = this.obj[guid];
				delete this.obj[guid];
				this.count--;
				return component;
			}
			public get(guid: string): Component {
				return this.obj[guid];
			}
			public set(component: Component): void {
				this.obj[component.guid] = component;
			}
		}
	}

	export class Utilities {
		public static parseData(data) {
			for (let i = 0; i < data.length; i++) {
				try {
					data[i].data = JSON.parse(data[i].data);
				} catch (error) {
					console.log(error);
				}
			}
			return data;
		}

		public static guid(): string {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
			return uuid;
		}

		public static randomId(): number {
			return (Math.floor(Math.random() * (9999999999 - 1000000000)) + 999999999);
		}
		public static camelCaseToSpace(string: string, capitalizeFirst?: boolean): string {
			var result = string.replace(/([A-Z])/g, " $1");

			// capitalize the first letter - as an example.
			if (capitalizeFirst)
				result = (result.charAt(0).toUpperCase() + result.slice(1)).trim();

			return result;
		}
		public static convertEnumToList(obj) {
			let list = {};
			for (let key in obj) {
				if (!isNaN(key)) {
					list[key] = Common.Utilities.camelCaseToSpace(obj[key], true);
				}
			}
			return list;
		}
		public static getEnumerationsOnly(obj) {
			let enums = {};
			for(var key in obj) {
				if(!!isNaN(key)) {
					enums[key] = obj[key];
				}
			}
			return enums;
		}
		public static getEnumerationsAsArray(obj) {
			let enums = [];
			for(var key in obj) {
				if(!isNaN(key)) {
					enums.push(parseInt(key));
				}
			}
			return enums;
		}

		public static isArray(obj: any) {
			return Object.prototype.toString.call(obj) == '[object Array]';
		}
		public static isObject(obj: any) {
			return typeof obj === 'object';
		}
		public static isFunction(obj: any) {
			typeof obj === 'function'
		}
		public static toJson(obj: any): any {
			let results = null;
			if(Common.Utilities.isObject(obj)) {
				results = Common.Utilities.toJsonRecursive(obj, {});
			} else if(Common.Utilities.isArray(obj)) {
				results = Common.Utilities.toJsonArrayRecursive(obj);
			} else {
				results = obj;
			}
			return results;
		}
		public static toJsonArrayRecursive(arr: any) {
			let jsonArr = [];
			for (let i = 0; i < arr.length; i++) {
				let raw = arr[i];
				let results = null;
				if (Common.Utilities.isArray(raw)) {
					results = Common.Utilities.toJsonArrayRecursive(raw);
				} else if (Common.Utilities.isObject(raw)) {
					results = Common.Utilities.toJson(raw);
				} else {
					results = raw;
				}
				jsonArr.push(results);
			}
			return jsonArr;
		}
		private static toJsonRecursive(obj: any, results: any): any {
			let keys = Object.keys(obj);
			if (!keys)
				return null;

			if (obj.toJson) {
				results = obj.toJson();
			} else {
				for (let i = 0; i < keys.length; i++) {
					let key = keys[i];
					if (!Common.Utilities.isFunction(obj[key])) {
						if (Common.Utilities.isObject(obj[key])) {
							if (obj[key].toJson) {
								// recurse
								results[key] = Common.Utilities.toJsonRecursive(obj[key].toJson(), {});
							}
						} else if (Common.Utilities.isArray(obj[key])) {
							results[key] = Common.Utilities.toJsonArrayRecursive(obj[key]);
						} else {
							results[key] = obj[key];
						}
					}
				}	
			}
			
			return results;
		}

		/**
		 * Generates and returns a hashed string from the given JSON object
		 * @param {any} json The object to be hashed
		 */
		public static generateChecksum(json: any) {
			return sjcl.hash.sha256.hash(JSON.stringify(json));
		}
	}
}