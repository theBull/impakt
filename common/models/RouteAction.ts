/// <reference path='./models.ts' />

module Common.Models {
    
	export abstract class RouteAction
	extends Common.Models.FieldElement {
		
		public routeNode: Common.Interfaces.IRouteNode;
		public action: Common.Enums.RouteNodeActions;

		constructor(action: Common.Enums.RouteNodeActions) {
			super();
			this.action = action;
		}			

		public initialize(field: Common.Interfaces.IField, routeNode: Common.Interfaces.IFieldElement): void {
			super.initialize(field, routeNode);
			this.routeNode = <Common.Interfaces.IRouteNode>routeNode;
			this.disabled = this.routeNode.type == Common.Enums.RouteNodeTypes.CurveControl;
            this.layer.type = Common.Enums.LayerTypes.PlayerRouteAction;
            this.graphics.setOffsetXY(0.5, 0.5);
            this.graphics.initializePlacement(new Common.Models.Placement(0, 0, this.routeNode));
		}

        public draw(): void {
            Common.Factories.RouteActionFactory.draw(this);
		}

		public toJson(): any {
			return $.extend({
				action: this.action
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.action = json.action;
			super.fromJson(json);
		}
	}
}