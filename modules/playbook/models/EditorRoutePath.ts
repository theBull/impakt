/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorRoutePath
	extends Common.Models.RoutePath
	implements Common.Interfaces.IRoutePath {

		constructor() {
			super();
		}

		public initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void {
			super.initialize(field, route);
			this.route.layer.addLayer(this.layer);
		}

		public draw(): void {
			super.draw();
            this.graphics.setAttribute('class', 'painted-fill pointer');

            this.onhover(this.hoverIn, this.hoverOut, this);
		}

		public hoverIn(e: any) {
			this.graphics.setStrokeWidth(6);
		}

		public hoverOut(e: any) {
			this.graphics.setStrokeWidth(3);
		}
	}

}