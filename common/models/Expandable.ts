/// <reference path='./models.ts' />

module Common.Models {
	export class Expandable
	extends Common.Models.Modifiable {

		public direction: string;
		public min: number; // in em's
		public max: number; // in em's
		public $element: any;
		public em: number;
		public collapsed: boolean;
		public ready: boolean;
		public url: string;
		public label: string;
		public handle: Common.Models.ExpandableHandle;
		public expandable: boolean;

		constructor($element: any) {
			super();
			super.setContext(this);
			// don't listen to modification changes
			// to Expandable objects
			this.listen(false);

			if (Common.Utilities.isNullOrUndefined($element))
				throw new Error('Expandable constructor(): $element is null or undefined');

			this.$element = $element;
			this.direction;
			this.min = 3; // in em's
			this.max = 32; // in em's
			this.em = parseInt($('body').css('font-size'));
			this.collapsed = true;
			this.ready = false;
			this.url = null;
			this.handle = new Common.Models.ExpandableHandle();
			this.expandable = true;

			// do a little clean up; the UI glitches due to the flex
			// property rendering if $element does not have an explicitly
			// set width, so we add the class 'width3' to the HTML element
			// by default and remove it once we're in here.
			this.$element.removeClass('width3');
		}

		public setHandleClass(): void {
			this.handle.class = this.collapsed ? this.handle.collapsed : this.handle.expanded;
		}

		/**
		 * Deprecated
		 * @param {[type]} value [description]
		 */
		public getWidth(width: number) {
			return this.em * width;
		}
		/**
		 * Deprecated
		 */
		public getInitialWidth() {
			return this.collapsed ? this.getWidth(this.min) : this.getWidth(this.max);
		}

		public getInitialClass() {
			return this.collapsed ? this.getMinClass() : this.getMaxClass();
		}

		public toggle() {
			!this.collapsed ? this.close() : this.open();
		}

		public open() {
			this.collapsed = false;

			if(this.expandable)
				this.$element.removeClass(this.getMinClass()).addClass(this.getMaxClass());

			this.setHandleClass();
		}

		public close() {
			this.collapsed = true;
			
			if (this.expandable)
				this.$element.removeClass(this.getMaxClass()).addClass(this.getMinClass());
			
			this.setHandleClass();
		}

		public getMinClass() {
			return 'width' + this.min;
		}
		public getMaxClass() {
			return 'width' + this.max;
		}

		public setInitialClass() {
			this.$element.addClass(this.getInitialClass());
		}

		public initializeToggleHandle() {
			switch (this.direction) {
				case 'left':
					this.handle.position = 'top0 left0';
					this.handle.expanded = 'glyphicon-chevron-right';
					this.handle.collapsed = 'glyphicon-chevron-left';
					break;
				case 'right':
					this.handle.position = 'top0 right0';
					this.handle.expanded = 'glyphicon-chevron-left';
					this.handle.collapsed = 'glyphicon-chevron-right';
					break;
				case 'top':
				case 'down':
					this.handle.position = 'top0 left0';
					this.handle.expanded = 'glyphicon-chevron-up';
					this.handle.collapsed = 'glyphicon-chevron-down';
					break;
				case 'bottom':
				case 'up':
					this.handle.position = 'bottom0 left0';
					this.handle.expanded = 'glyphicon-chevron-down';
					this.handle.collapsed = 'glyphicon-chevron-up';
					break;
			}

			this.setHandleClass();
		}

	}

	export class ExpandableHandle {
		
		public position: string;
		public collapsed: string;
		public expanded: string;
		public class: string;

		constructor() {
			this.position = '';
			this.collapsed = '';
			this.expanded = '';
			this.class = '';
		}	
	}
}