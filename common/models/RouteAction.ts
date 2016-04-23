/// <reference path='./models.ts' />

module Common.Models {
    
	export abstract class RouteAction
	extends Common.Models.FieldElement {
		
		public routeNode: Common.Interfaces.IRouteNode;
		public action: Common.Enums.RouteNodeActions;
		public actionable: boolean;

		constructor(routeNode: Common.Models.RouteNode, action: Common.Enums.RouteNodeActions) {
			super(routeNode.field, routeNode);

			this.routeNode = routeNode;
			this.action = action;
			this.actionable = !(this.routeNode.type == Common.Enums.RouteNodeTypes.CurveControl);
            this.layer.type = Common.Enums.LayerTypes.PlayerRouteAction;
		}			

        public draw(): void {
            Common.Factories.RouteActionFactory.draw(this);
		}

		public toJson(): any {
			return {
				action: this.action,
				actionable: this.actionable
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.action = json.action;
			this.actionable = json.actionable;
		}
	}
}