/// <reference path='./models.ts' />

module Common.Models {

	export abstract class Actionable
	extends Common.Models.Modifiable
	implements Common.Interfaces.IActionable,
    Common.Interfaces.IContextual,
    Common.Interfaces.IHoverable {

		public impaktDataType: Common.Enums.ImpaktDataTypes;
        public graphics: Common.Models.Graphics;
		public disabled: boolean;
		public clickable: boolean;
		public hoverable: boolean;
        public hovered: boolean;
		public selected: boolean;
		public selectable: boolean;
        public dragging: boolean;
        public draggable: boolean;
        public flipped: boolean;
        public flippable: boolean;
        public contextmenuTemplateUrl: string;
        public actions: Common.Models.ActionRegistry;

		constructor(impaktDataType: Common.Enums.ImpaktDataTypes) {
			super();
			super.setContext(this);

			this.impaktDataType = impaktDataType;
			this.disabled = false;
            this.selected = false;
            this.clickable = true;
            this.hoverable = true;
            this.hovered = false;
            this.dragging = false;
            this.draggable = true;
            this.selectable = true;
            this.flipped = false;
            this.flippable = false;
		}

		public toJson(): any {
            return $.extend({
                graphics: this.hasGraphics() ? this.graphics.toJson() : null
            }, super.toJson());
        }

		public fromJson(json: any): void {
            if(!json)
			    return;

            // if(json.graphics)
            //     this.graphics.fromJson(json.graphics);

            super.fromJson(json);
		}

        public hasGraphics(): boolean {
            return Common.Utilities.isNotNullOrUndefined(this.graphics);
        }

        /**
         * Toggles the opacity for show/hide effect
         */
        public toggleOpacity(): void {
            if (!this.disabled &&
                !this.selected &&
                this.hoverable) {

                this.graphics.toggleOpacity();
            }
        }

		/**
         * Generic selection toggle
         */
        public isSelectable(): boolean {
            return !this.disabled && this.selectable;
        }

        public toggleSelect(metaKey?: boolean): void {
            metaKey = metaKey === true;
            if (!this.isSelectable())
                return;

            if (this.selected)
                this.deselect();
            else
                this.select();
        }
        /**
         * Generic selection method
         */
        public select(): void {
            if (!this.isSelectable())
                return;

            this.selected = true;

            if (this.hasGraphics()) {
                this.graphics.select();
            }
        }
        /**
         * Generic deselection method
         */
        public deselect(): void {
            if (!this.isSelectable())
                return;

            this.selected = false;

            if(this.hasGraphics()) {
                this.graphics.deselect();
            }
        }
        /**
         * Generic disable method
         */
        public disable(): void {
            this.disabled = true;

            if(this.hasGraphics()) {
                this.graphics.disable();
            }
        }
        /**
         * Generic enable method
         */
        public enable(): void {
            this.disabled = false;

            if (this.hasGraphics()) {
                this.graphics.enable();
            }
        }

        public getContextmenuUrl(): string {
            return this.contextmenuTemplateUrl;
        }

        public drop(): void {
            this.dragging = false;

            if(this.hasGraphics())
                this.graphics.drop();
        }

        public onhover(hoverIn: any, hoverOut: any, context: Common.Interfaces.IActionable): void {
            if (this.hasGraphics())
                this.graphics.onhover(hoverIn, hoverOut, context);
        }
        public hoverIn(e: any) {
            this.hovered = true;

            if(this.hasGraphics())
                this.graphics.hoverIn(e);
        }
        public hoverOut(e: any) {
            this.hovered = false;

            if(this.hasGraphics())
                this.graphics.hoverOut(e);
        }
        public onclick(fn: any, context: Common.Interfaces.IActionable): void {
            if (this.hasGraphics())
                this.graphics.onclick(fn, context);
        }
        public click(e: any): void {
            if (this.hasGraphics())
                this.graphics.click(e);
        }
        public oncontextmenu(fn: any, context: Common.Interfaces.IActionable): void {
            if (this.hasGraphics())
                this.graphics.oncontextmenu(fn, context);
        }
        public contextmenu(e: any): void {
            if (this.hasGraphics())
                this.graphics.contextmenu(e);
        }
        public onmousedown(fn: any, context: Common.Interfaces.IActionable): void {
            if (this.hasGraphics())
                this.graphics.onmousedown(fn, context);
        }
        public onmouseup(fn: any, context: Common.Interfaces.IActionable): void {
            if(this.hasGraphics())
                this.graphics.onmouseup(fn, context);
        }
        public mousedown(e: any): void {
            if (this.hasGraphics())
                this.graphics.mousedown(e);
        }
        public onmousemove(fn: any, context: Common.Interfaces.IActionable): void {
            if(this.hasGraphics())
                this.graphics.onmousemove(fn, context);
        }
        public mousemove(e: any): void {
            if (this.hasGraphics())
                this.graphics.mousemove(e);
        }
        public ondrag(
            dragMove: Function,
            dragStart: Function,
            dragEnd: Function,
            context: Common.Interfaces.IActionable
        ): void {
            if(this.hasGraphics())
                this.graphics.ondrag(dragMove, dragStart, dragEnd, context);
        }

	}

}