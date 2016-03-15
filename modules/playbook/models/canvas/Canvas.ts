/// <reference path='../models.ts' />

module Playbook.Models {

	export class Canvas 
		extends Common.Models.Storable
		implements Playbook.Interfaces.ICanvas, 
		Playbook.Interfaces.IListener {

		public container: HTMLElement;
		public $container: any;
		public $exportCanvas: any;
		public exportCanvas: HTMLCanvasElement;
		
		public tab: Playbook.Models.Tab
		public paper: Playbook.Models.Paper;
		public playPrimary: Playbook.Models.PlayPrimary;
		public playOpponent: Playbook.Models.PlayOpponent;

		public unitType: Playbook.Editor.UnitTypes;
		public editorType: Playbook.Editor.EditorTypes;
		
		public toolMode: Playbook.Editor.ToolModes;
		public key: string;
		public width: number;
		public height: number;
		public minWidth: number;
		public minHeight: number;
		public _scrollable: any;

		protected widthChangeInterval: any;
		private listener: Playbook.Models.CanvasListener;
		private readyCallbacks: Function[];

		constructor(
			playPrimary: Playbook.Models.PlayPrimary,
			playOpponent: Playbook.Models.PlayOpponent,
			width?: number, 
			height?: number
		) {
			super();

			/**
			 * TODO @theBull - find a better way to pass data into the canvas...
			 * it shouldn't be dependent on play data at this level..........? maybe?
			 */
			this.playPrimary = playPrimary;	
			this.playOpponent = playOpponent;

			/**
			 * Note that paper is created during the initialize() method;
			 * canvas is dependent on angular directive / dynamic HTML include
			 * of the canvas, before the $container/container properties are
			 * available; these containers are required by the paper, which
			 * implements a Raphael object, that requires a container HTML element.
			 */

			//this.unitType = this.playPrimary.unitType;
			//this.editorType = this.playPrimary.editorType;
			this.toolMode = Playbook.Editor.ToolModes.Select;

			// need to set tab explicitly if it's within an editor
			this.tab = null;

			this.minWidth = 500;
			this.minHeight = 400;
			this.listener = new Playbook.Models.CanvasListener(this);
			this.readyCallbacks = [function() {
				console.log('CANVAS READY: default canvas ready callback');
			}];

			// TODO @theBull - look for performance improvements here
			// 
			// Maintains a window interval timer which checks every 1ms for
			// a change in container width; will fire a resize() if necessary
			this.widthChangeInterval = null;

		}

		/**
		 * Converts this canvas's SVG graphics element into a data-URI 
		 * which can be used in an <img/> src attribute to render the image
		 * as a PNG. Allows for retrieval and storage of the image as well.
		 * 
		 * 3/9/2016: https://css-tricks.com/data-uris/
		 * @return {string} [description]
		 */
		public exportToPng(): string {
			if(!this.$container) {
				throw new Error('Canvas exportToPng(): Cannot export to png; \
					SVG parent $container is null or undefined');
			}
			let svgElement = this.$container.find('svg')[0];
			if(!svgElement) {
				throw new Error('Canvas exportToPng(): Cannot export to png; \
					Could not find SVG element inside of canvas $container');
			}
			return Common.Utilities.exportToPng(this, svgElement);
		}

		public initialize($container: any) {
			var self = this;

			this.container = $container[0]; // jquery lite converted to raw html
			this.$container = $container; // jquery lite object
			this.width = this.$container.width();
			this.height = this.$container.height();
			
			this.paper = new Playbook.Models.Paper(this);

			this.paper.draw();

			// TODO @theBull - stop / pause this timer if the canvas is not
			// visible...
			// this.widthChangeInterval = setInterval(function() {
			// 	if(self.width != self.$container.width()) {
			// 		// width has changed; update the canvas dimensions and
			// 		// resize.
			// 		self.width = self.$container.width();
			// 		self.height = self.$container.height();
			// 		self.resize();
			// 	}
			// }, 1);

			this._ready();
 		}

 		public updatePlay(
 			playPrimary: Playbook.Models.PlayPrimary, 
 			playOpponent: Playbook.Models.PlayOpponent,
 			redraw?: boolean
 		) {
			this.playPrimary = playPrimary || this.playPrimary;
			this.playOpponent = playOpponent || this.playOpponent;
			this.unitType = this.playPrimary.unitType;
			this.editorType = this.playPrimary.editorType;

			this.paper.updatePlay(this.playPrimary, this.playOpponent);
 		}

		public onready(callback: Function) {
			if(this.readyCallbacks && this.readyCallbacks.length > 1000)
				throw new Error('Canvas onready(): callback not added; max ready callback limit exceeded');
			this.readyCallbacks.push(callback);
		}

		private _ready() {
			for(let i = 0; i < this.readyCallbacks.length; i++) {
				this.readyCallbacks[i]();
			}
		}

 		public getSvg(): string {
 			let $svg = $('svg');
 			let serializer = new XMLSerializer();
 			let svg_blob = serializer.serializeToString($svg[0]);
 			return svg_blob;
 		}

 		public resize() {
			var self = this;
			this.width = this.$container.width();
			this.height = this.$container.height();

			this.paper.resize();

			if(this._scrollable) {
				this._scrollable.initialize(this.$container, this.paper);
				this._scrollable.onready(function(content) {
					self._scrollable.scrollToPercentY(0.5);
				});
			}

 		}

 		public setScrollable(_scrollable: any) {
			this._scrollable = _scrollable;
 		}

 		public resetHeight(): void {
			//this.height = this.$container.height(this.$container.height());
 		}

		public listen(actionId: Playbook.Editor.CanvasActions, fn: any): void {
			this.listener.listen(actionId, fn);
 		}

		public invoke(actionId: Playbook.Editor.CanvasActions, data: any, context: any): void {
			console.log('invoking action: ', actionId);
			this.listener.invoke(actionId, data, context);
 		}

		public zoomIn(): void {
			throw new Error('canvas zoomIn() not implemented');
		}

		public zoomOut(): void {
			throw new Error('canvas zoomOut() not implemented');
		}
		public getToolMode(): Playbook.Editor.ToolModes {
			return this.toolMode;
		}
		public getToolModeName(): string {
			return Playbook.Editor.ToolModes[this.toolMode];
		}

		public getPaperWidth() {
			var width = Math.max(this.$container.width(), this.minWidth);
			var paperWidth = (
				Math.ceil(width / this.getGridSize()) *
				this.getGridSize()
			) - (4 * this.getGridSize());

	    	return paperWidth;
	    }

	    public getPaperHeight() {
			var height = Math.max(this.$container.height(), this.minHeight);
			var paperHeight = (
				Math.ceil(height / this.getGridSize()) * 
				this.getGridSize()
			) - (4 * this.getGridSize());

	    	return paperHeight;
	    }

	    public getGridSize(): number {
	    	return this.paper && this.paper.grid && this.paper.grid.getSize();
	    }

	}	

	
}