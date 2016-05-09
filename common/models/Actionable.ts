/// <reference path='./models.ts' />

module Common.Models {

	export abstract class Actionable
	extends Common.Models.Modifiable
	implements Common.Interfaces.IActionable {

		public impaktDataType: Common.Enums.ImpaktDataTypes;
		public disabled: boolean;
		public clickable: boolean;
		public hoverable: boolean;
		public selected: boolean;
		public selectable: boolean;
        public dragging: boolean;
        public draggable: boolean;
        public dragged: boolean;

		constructor(impaktDataType: Common.Enums.ImpaktDataTypes) {
			super();
			super.setContext(this);

			this.impaktDataType = impaktDataType;
			this.disabled = false;
            this.selected = false;
            this.clickable = true;
            this.hoverable = true;
            this.dragging = false;
            this.draggable = true;
            this.dragged = false;
            this.selectable = true;
		}

		public toJson(): any {
            return super.toJson();
        }

		public fromJson(json: any): void {
            if(!json)
			    return;

            super.fromJson(json);
		}

		/**
         * Generic selection toggle
         */
        public toggleSelect(): void {
            if (this.disabled || !this.selectable)
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
            if (this.disabled || !this.selectable)
                return;

            this.selected = true;
        }
        /**
         * Generic deselection method
         */
        public deselect(): void {
            if (this.disabled || !this.selectable)
                return;

            this.selected = false;
        }
        /**
         * Generic disable method
         */
        public disable(): void {
            this.disabled = true;
        }
        /**
         * Generic enable method
         */
        public enable(): void {
            this.disabled = false;
        }
		
		// TODO @theBull - implement here?
		public oncontextmenu(fn: any, context: any): void {

		}
		// TODO @theBull - implement here?
		public contextmenu(e: any, context: any): void {

		}

	}

}