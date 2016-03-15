/// <reference path='../models.ts' />

module Playbook.Models {

	export class Canvas 
		implements Playbook.Interfaces.ICanvas, 
		Playbook.Interfaces.IListener,
		Playbook.Interfaces.IFieldContext {

		public context: any;
		public container: HTMLElement;
		public $container: any;
		public tab: Playbook.Models.Tab;
		public paper: Playbook.Models.Paper;
		public field: Playbook.Models.Field;
		public grid: Playbook.Models.Grid;
		public center: Playbook.Models.Coordinate;
		public type: Playbook.Editor.UnitTypes;
		public editorType: Playbook.Editor.EditorTypes;
		public play: Playbook.Models.Play;
		public editorMode: Playbook.Editor.EditorModes;
		public key: string;
		public width: number;
		public height: number;
		public minWidth: number;
		public minHeight: number;
		public rows: number;
		public cols: number;
		public gridsize: number;
		public active: boolean;
		public OFFSET: number;
		public _scrollable: any;

		private listener: Playbook.Models.CanvasListener;		

		constructor(
			play: Playbook.Models.Play,
			gridsize?: number, 
			width?: number, 
			height?: number,
			cols?: number,
			rows?: number
		) {

			this.play = play;
			this.type = this.play.type;
			this.editorType = this.play.editorType;

			// todo - right now, can only set this explicitly 
			// and not through initialization. Enable as initialization setting?
			this.editorMode = Playbook.Editor.EditorModes.Select;

			this.active = true;

			// need to set tab explicitly if it's within an editor
			this.tab = null;
			
			this.key = Common.Utilities.guid();
			this.gridsize = gridsize || 16;
			this.rows = rows || 120;
			this.cols = cols || 52;
			this.width = width || 0;
			this.height = height || 0;
			this.minWidth = 500;
			this.minHeight = 500;

			this.listener = new Playbook.Models.CanvasListener(this);

			this.OFFSET = 50;

		}

		public initialize($container: any) {
			var self = this;
			this.container = $container[0]; // jquery lite converted to raw html
			this.$container = $container; // jquery lite object
			this.width = this.width || this.$container.width();
			this.height = this.height || this.$container.height();

			// +2 for sidelines
			// take the lowest number to allow for spacing around the field
			this.gridsize = Math.floor(this.width / this.cols);

			// allows for an extra grid units of spacing around the field
			var paperWidth = this.cols * this.gridsize;
			var paperHeight = this.rows * this.gridsize;
			this.paper = new Playbook.Models.Paper(
				this, paperWidth, paperHeight
			);
			// console.log('paper dimensions: ', this.paper.width, this.paper.height);

			this.grid = new Playbook.Models.Grid(
				this, 
				this.cols, 
				this.rows, 
				this.gridsize
			);

			// $(window).resize(function() {
			// 	self.resize();
			// });

			let i = setInterval(function() {
				if(self.width != self.$container.width()) {
					self.width = self.$container.width();
					self.height = self.$container.height();

					console.log(
						'container size changed',
						self.$container.width(), ' -> ', self.width,
						self.$container.height(), ' -> ', self.height
					);
					//self.paper.resize(self.width);
					//self.paper.setViewBox();

					self.resize();
				}
			}, 1);

			// clear any existing contents 
			this.paper.clear();
			this.paper.setViewBox();
		
			// @todo - abstract this. not every canvas will implement
			this.field = new Playbook.Models.Field(
				this, this.play
			);
		    this.field.draw();

			this.grid.draw();

 		}

 		public resize() {
			var self = this;
			this.width = this.$container.width();
			this.height = this.$container.height();

			// +2 for sidelines
			// take the lowest number to allow for spacing around the field
			this.gridsize = Math.floor(this.width / this.cols);

			// remove the svg element from the DOM
			this.paper.Raphael.remove();

			// allows for an extra grid units of spacing around the field
			var paperWidth = this.cols * this.gridsize;
			var paperHeight = this.rows * this.gridsize;
			this.paper = new Playbook.Models.Paper(
				this, paperWidth, paperHeight
			);
			// console.log('paper dimensions: ', this.paper.width, this.paper.height);

			this.grid = new Playbook.Models.Grid(
				this,
				this.cols,
				this.rows,
				this.gridsize
			);

			// clear any existing contents 
			this.paper.clear();
			this.paper.setViewBox();
	
			// @todo - abstract this. not every canvas will implement
			this.field = new Playbook.Models.Field(
				this, this.play
			);
			this.field.draw();

			this.grid.draw();

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
			if(this.grid.GRIDSIZE < 25) {
				this.grid.GRIDSIZE += 2;
			}
		}

		public zoomOut(): void {
			if(this.grid.GRIDSIZE > 12) {
				this.grid.GRIDSIZE -= 2;
				//TODO: fix this.initialize();
			}
		}

		public getEditorMode(): string {
			return Playbook.Editor.EditorModes[this.editorMode];
		}

		public getPaperWidth() {
			var width = Math.max(this.$container.width(), this.minWidth);
			var paperWidth = (Math.ceil(width / this.gridsize) * this.gridsize) - (4*this.gridsize);

	    	return paperWidth;
	    }

	    public getPaperHeight() {
			var height = Math.max(this.$container.height(), this.minHeight);
			var paperHeight = (Math.ceil(height / this.gridsize) * this.gridsize) - (4 * this.gridsize);

	    	return paperHeight;
	    }

	}	

	
}