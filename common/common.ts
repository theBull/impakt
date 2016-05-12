/// <reference path='../js/impakt.ts' />
/// <reference path='../modules/modules.ts' />
/// <reference path='./models/models.ts' />
/// <reference path='./enums/enums.ts' />
/// <reference path='./interfaces/interfaces.ts' />
/// <reference path='./constants/constants.ts' />
/// <reference path='./factories/factories.ts' />

module Common {
	export module API {
		export enum Actions {
			Nothing,
			Create,
			Overwrite,
			Copy
		}
	}
	export module Base {

		/**
		 * The Common.Base.Component class allows you to dynamically
		 * track when angular controllers, services, factories, etc. are
		 * being loaded as dependencies of one another. 
		 *
		 * TODO: Investigate this further; I implemented this early on
		 * during development and may not have had a firm grasp on 
		 * the loading order of various angular components. I didn't 
		 * really take clear note of why I implemented this in the first place;
		 * I believe it was necessary. I just need to validate my initial
		 * assumptions.
		 * 
		 */
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

		public static notImplementedException() {
			throw new Error('Exception: Method not implemented');
		}

		public static exportToPng(canvas: Common.Interfaces.ICanvas, svgElement: HTMLElement)
		: string {
			if(!svgElement)
				throw new Error('play-preview: Corresponding SVG element not found');

			// Serialize the SVG XML into a string
			let svgString = Common.Utilities.serializeXMLToString(svgElement);
			
			// canvg javascript library takes the canvas HTML element and the SVG
			// in string form
			canvg(canvas.exportCanvas, svgString);

			// the exportCanvas is a <canvas/> element, which possesses a method
			// to export its data as a PNG data URL
			let pngDataURI = canvas.exportCanvas.toDataURL("image/png");
			
			return pngDataURI;
		}

		/**
		 * Compresses the given SVG element into a compressed string
		 * @param  {HTMLElement} svg SVG element to handle
		 * @return {string}          the compressed SVG string
		 */
		public static compressSVG(svg: HTMLElement): string {
			let serialized = Common.Utilities.serializeXMLToString(svg);
			let encoded = Common.Utilities.toBase64(serialized);
			
			// TODO: NEED TO FIX COMPRESSION ISSUE. USING THIS METHOD CAUSES 
			// THE COMPRESSED CHARACTERS (NON UTF-8) TO BE CONVERTED TO '?'
			// WHICH BREAKS PARSING
			//return Common.Utilities.compress(encoded);
			return encoded;
		}

		/**
		 * Compresses the given string
		 * @param  {string} svg String to compress
		 * @return {any}        a compressed svg string
		 */
		public static compress(str: string): string {
			return LZString.compress(str);
		}

		/**
		 * Takes a compressed SVG data and decompresses it
		 * @param  {string} compressed The compressed SVG data to decompress 
		 * @return {string}            The decompressed string of SVG
		 */
		public static decompressSVG(compressed: string): string {
			// TO-DO: COMPRESSION BROKEN; SEE COMPRESSSVG ABOVE FOR NOTES
			//let decompressed = Common.Utilities.decompress(compressed);
			//return Common.Utilities.fromBase64(decompressed); 
			
			return Common.Utilities.fromBase64(compressed);
		}

		/**
		 * Decompresses the given string
		 * @param  {string} compressed The (compressed) string to decompress
		 * @return {string}            the decompressed string
		 */
		public static decompress(compressed: string): string {
			return LZString.decompress(compressed);
		}

		/**
		 * Encodes the given string of SVG into base64
		 * @param  {string} svgString svg string
		 * @return {string}           base64 encoded svg string
		 */
		public static toBase64(str: string): string {
			return window.btoa(str);
		}

		/**
		 * Decodes the given base64 encoded svg string
		 * @param  {string} base64Svg base64 encoded svg string
		 * @return {string}           decoded svg string
		 */
		public static fromBase64(str: string): string {
			return window.atob(str);
		}

		/**
		 * Converts the given SVG HTML element into a string
		 * @param  {HTMLElement} svg Element to convert to string
		 * @return {string}          returns the stringified SVG element
		 */
		public static serializeXMLToString(xml: any): string {
			return (new XMLSerializer()).serializeToString(xml);
		}
		
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

		/**
		 * Returns a random number between min (inclusive) and max (inclusive)
		 * @param  {number} min [description]
		 * @param  {number} max [description]
		 * @return {number}     [description]
		 */
		public static randomInt(min: number, max: number): number {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		public static randomId(): number {
			return (Math.floor(Math.random() * (9999999999 - 1000000000)) + 999999999);
		}
		public static camelCaseToSpace(string: string, capitalizeFirst?: boolean): string {
			var result = string.replace(/([A-Z])/g, " $1");

			// capitalize the first letter - as an example.
			if (capitalizeFirst)
				result = Common.Utilities.sentenceCase(result);

			return result;
		}
		public static sentenceCase(str: string) {
			return (str.charAt(0).toUpperCase() + str.slice(1)).trim();
		}
		public static convertEnumToList(obj) {
			let list = {};
			for (let key in obj) {
				if (!isNaN(key)) {
					list[parseInt(key)] = Common.Utilities.camelCaseToSpace(obj[key], true);
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
			return objectHash(json, {});
		}

		private static prepareObjectForEncoding(obj) {
			let output = null;
			if(Array.isArray(obj)) {
				let arr = obj;
				for (let i = 0; i < arr.length; i++) {
					let arrItem = arr[i];
					output = Common.Utilities.prepareObjectForEncoding(arrItem);
				}				
			} else {
				let keys = Object.keys(obj).sort();
				output = [];
				let prop;
				for (var i = 0; i < keys.length; i++) {
					prop = keys[i];
					output.push(prop);
					output.push(obj[prop]);
				}
			}
		    return output;
		}

		public static isNullOrUndefined(obj: any): boolean {
			return Common.Utilities.isNull(obj) || Common.Utilities.isUndefined(obj);
		}

		public static isNull(obj: any): boolean {
			return obj === null;
		}

		public static isUndefined(obj: any): boolean {
			return obj === undefined || obj === 'undefined';
		}

		public static isEmptyString(str: string): boolean {
			return Common.Utilities.isNullOrUndefined(str) || str === '';
		}

		/**
		 * Iterates over the given array and removes any
		 * duplicate entries
		 * 
		 * @param  {any[]} array [description]
		 * @return {any[]}       [description]
		 */
		public static uniqueArray(array: any[]): any[] {
			if (Common.Utilities.isNullOrUndefined(array))
				throw new Error('Utilities uniqueArray(): array is null or undefined');

			let unique = [];
			for (let i = 0; i < array.length; i++) {
				let element = array[i];

				if (unique.indexOf(element) < 0)
					unique.push(element);
			}
			return unique;
		}
	}
}

module Common.UI {
	export const SCROLL_BAR_SIZE = 12;
}