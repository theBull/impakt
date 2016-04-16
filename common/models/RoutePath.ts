/// <reference path='./models.ts' />

module Common.Models {

	export abstract class RoutePath
	extends Common.Models.FieldElement {

		public route: Common.Interfaces.IRoute;
		public pathString: string;

		constructor(route: Common.Interfaces.IRoute) {
			super(route.player.field, route.player);

			this.route = route;
            this.layer.graphics.originalFill = 'black';
            this.layer.graphics.originalStrokeWidth = 2;
		}

		public toJson(): any {
			return {
				pathString: this.pathString
			}
		}

		public remove(): void {
			this.layer.remove();
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.pathString = json.pathString;
		}

		/**
		 * Draws a RoutePath graphic onto thhe paper;
		 * NOTE: assumes the pathString is already set to a valid SVG path string
		 */
		public draw(): void {
            this.layer.graphics.path(this.pathString);
            this.layer.graphics.setAttribute('class', 'painted-fill');
		}

	}

}