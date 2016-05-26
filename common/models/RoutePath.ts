/// <reference path='./models.ts' />

module Common.Models {

	export abstract class RoutePath
	extends Common.Models.FieldElement {
 
		public route: Common.Interfaces.IRoute;
		public pathString: string;
		public unitType: Team.Enums.UnitTypes;

		constructor() {
			super();
		}

		public initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void {
			super.initialize(field, route);
			this.route = <Common.Interfaces.IRoute>route;
			this.unitType = this.route.unitType;
			this.graphics.setOriginalFill(null);
			this.graphics.setOriginalOpacity(1);

			switch(this.unitType) {
				case Team.Enums.UnitTypes.Offense:
					this.graphics.setOriginalStroke('#001199');
					break;
				case Team.Enums.UnitTypes.Defense:
					this.graphics.setOriginalStroke('#0063FF');
					break;
				case Team.Enums.UnitTypes.SpecialTeams:
					this.graphics.setOriginalStroke('black');
					break;
				case Team.Enums.UnitTypes.Other:
					this.graphics.setOriginalStroke('#333333');
					break;
				default:
					this.graphics.setOriginalStroke('#22B98F');
					break;
			}
            
            this.graphics.setOriginalStrokeWidth(3);
            this.graphics.initializePlacement(this.route.graphics.placement);
            this.layer.type = Common.Enums.LayerTypes.PlayerRoutePath;
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
		 * Draws a RoutePath graphic onto the paper;
		 * NOTE: assumes the pathString is already set to a valid SVG path string
		 */
		public draw(): void {
            this.graphics.path(this.pathString);
            this.graphics.setAttribute('class', 'painted-fill');
		}

	}

}