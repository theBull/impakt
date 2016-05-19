/// <reference path='./models.ts' />

module Common.Models {

	export abstract class RouteControlPath
	extends Common.Models.FieldElement {

		public routeNode: Common.Interfaces.IRouteNode;
        public pathString: string;

		constructor() {
			super();
        }

        public initialize(field: Common.Interfaces.IField, routeNode: Common.Interfaces.IFieldElement): void {
            super.initialize(field, routeNode);
            this.routeNode = <Common.Interfaces.IRouteNode>routeNode;
            this.layer.type = Common.Enums.LayerTypes.PlayerRouteControlPath;

            this.graphics.setStroke('grey');
            this.graphics.setStrokeWidth(1);
            this.graphics.setOpacity(0.2);
        }

        public toJson(): any {
            return {
                pathString: this.pathString
            }
        }

        public fromJson(json: any) {
            if (!json)
                return;

            this.pathString = json.pathString;
        }

		public draw(): void {
            // TODO @theBull - implement

            // let startNode, controlNode, endNode;

            // if (this.routeNode.type == Common.Enums.RouteNodeTypes.CurveControl) {
            //     if (!this.routeNode.node.next || !this.routeNode.node.prev) {
            //         throw new Error('controlNode does not have next and prev nodes');
            //     }
            //     startNode = this.routeNode.node.prev.data;
            //     controlNode = this;
            //     endNode = this.routeNode.node.next.data;
            // }
            // else if (this.routeNode.type == Common.Enums.RouteNodeTypes.CurveEnd) {
            //     if (!this.routeNode.node.prev || !this.routeNode.node.prev.prev) {
            //         throw new Error(['endNode node does not have previous controlNode or previous',
            //             'curve startNode nodes'].join(''));
            //     }
            //     startNode = this.routeNode.node.prev.prev.data;
            //     controlNode = this.routeNode.node.prev.data;
            //     endNode = this;
            // }
            // else if (this.routeNode.type == Common.Enums.RouteNodeTypes.CurveStart) {
            //     if (!this.routeNode.node.next || !this.routeNode.node.next.next) {
            //         throw new Error(['curve startNode node does not have subsequent',
            //             'controlNode and endNode nodes'].join(''));
            //     }
            //     startNode = this;
            //     controlNode = this.routeNode.node.next.data;
            //     endNode = this.routeNode.node.next.next.data;
            // }

            // // Generate a path string between the given startNode, controlNode, and endNode nodes
            // this.pathString = this.routeNode.player.route.getPathStringFromNodes(true, [startNode, controlNode, endNode]);

            // startNode.graphics.path(this.pathString);
		}

	}

}