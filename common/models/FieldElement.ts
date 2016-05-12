/// <reference path='./models.ts' />

module Common.Models {
	
	export abstract class FieldElement 
	extends Common.Models.Modifiable
	implements Common.Interfaces.IFieldElement,
	Common.Interfaces.ILayerable,
    Common.Interfaces.IContextual {
		
		public field: Common.Interfaces.IField;
		public ball: Common.Interfaces.IBall;
		public canvas: Common.Interfaces.ICanvas;
		public paper: Common.Interfaces.IPaper;
		public grid: Common.Interfaces.IGrid;
		public layer: Common.Models.Layer;
		public relativeElement: Common.Interfaces.IFieldElement;
		public name: string;
        private _originalScreenPositionX: number;
        private _originalScreenPositionY: number;

		/**
         *
         * contextual attributes
         * 
         */
        public contextmenuTemplateUrl: string;

		constructor(
			field: Common.Interfaces.IField,
			relativeElement: Common.Interfaces.IFieldElement
		) { 
			super();
			super.setContext(this);

			this.field = field;
			this.ball = this.field.ball;
			this.relativeElement = relativeElement;
			this.paper = this.field.paper;
			this.canvas = this.paper.canvas;
			this.grid = this.paper.grid;
		    this.contextmenuTemplateUrl = Common.Constants.DEFAULT_CONTEXTMENU_TEMPLATE_URL;
            this.layer = new Common.Models.Layer(this.paper, Common.Enums.LayerTypes.FieldElement);

            this._originalScreenPositionX = null;
            this._originalScreenPositionY = null;

            let self = this;
            this.onModified(function() {
                self.field.setModified(true);
            });
		}

        public hasLayer(): boolean {
            return this.layer != null && this.layer != undefined;
        }
        public getLayer(): Common.Models.Layer {
            return this.layer;
        }
        public hasGraphics(): boolean {
            return this.layer.hasGraphics();
        }
        public getGraphics(): Common.Models.Graphics {
            return this.hasGraphics() ? this.layer.graphics : null;
        }
        public hasPlacement(): boolean {
            return this.layer.hasPlacement();
        }
        public getContextmenuUrl(): string {
          return this.contextmenuTemplateUrl;
        }

        public toggleSelect(metaKey: boolean): void {
          this.field.toggleSelection(this);
          {
            if (metaKey) {
              this.field.toggleSelection(this);
            } else {
              this.field.setSelection(this);
            }
          }
        }

        /**
         *
         *
         * DEFAULT METHOD
         * Each field element will inherit the following default methods.
         *
         * Because of the wide variety of field elements, it is difficult to 
         * provide default event handlers that fit for every one of them. 
         * Abstract or Implementing Classes that do not execute the same 
         * event logic must define an override method to override the default method.
         * 
         * 
         */
        /**
         * Draw is abstract, as it will be different for every field element;
         * each field element must implement a draw method.
         */
        public abstract draw(): void;

        public hoverIn(e: any): void {

        }
        public hoverOut(e: any): void {

        }
        public click(e: any): void {
            console.log('fieldelement click');
            if (this.layer.graphics.disabled)
                return;

            this.layer.graphics.toggleSelect();
            if(e.metaKey) {
                this.field.toggleSelection(this);    
            } else {
                this.field.setSelection(this);
            }
        }
        public mouseup(e: any): void {

        }
        public mousedown(e: any): void {
            if(e.keyCode == Common.Input.Which.RightClick) {
                this.contextmenu(e);
            }
        }
        public mousemove(e: any): void {
            // TODO @theBull - implement
        }
		public contextmenu(e: any): void {
            // TODO @theBull - handle contextmenu
        }
		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
        }
		public dragStart(x: number, y: number, e: any): void {
            this.setOriginalDragPosition(x, y);

            if (this.isOverDragThreshold(
                this.getOriginalScreenPosition().x - x,
                this.getOriginalScreenPosition().y - y)) {

                this.layer.graphics.dragging = true;
            }
        }
		public dragEnd(e: any): void {
            this.setOriginalDragPosition(null, null);
            this.layer.graphics.dragging = false;
        }
		public drop(): void {
            this.layer.drop();
        }

        public getOriginalScreenPosition(): {x: number, y: number} {
            return {
                x: this._originalScreenPositionX,
                y: this._originalScreenPositionY
            };
        }

        public setOriginalDragPosition(x: number, y: number) {
            this._originalScreenPositionX = x;
            this._originalScreenPositionY = y;
        }

        public isOriginalDragPositionSet(): boolean {
            return !Common.Utilities.isNull(this._originalScreenPositionX) &&
                !Common.Utilities.isNull(this._originalScreenPositionY);
        }

        public isOverDragThreshold(x, y): boolean {
            return Math.abs(x) > Playbook.Constants.DRAG_THRESHOLD_X ||
                Math.abs(y) > Playbook.Constants.DRAG_THRESHOLD_Y;
        }
	}
}