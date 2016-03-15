
module Playbook.Models {
	export class RoutePath extends FieldElement {

		public static ROUTE_WIDTH = 5;

		public context: Playbook.Models.Route;
		public paper: Playbook.Models.Paper;
		public title: string;
		public width: number;
		public startNode: Playbook.Models.RouteNode;
		public endNode: Playbook.Models.RouteNode;
		public path: any;

		constructor(
			context: Playbook.Models.Route,
			startNode: Playbook.Models.RouteNode,
			endNode: Playbook.Models.RouteNode) {

			super(context);

			this.startNode = startNode;
			this.endNode = endNode;
			this.title = 'route';
			this.width = RoutePath.ROUTE_WIDTH;
		}

		public draw(): any {

			// console.log(
			// 	'draw route from: ',
			// 	this.startNode.x,
			// 	this.startNode.y,
			// 	this.endNode.x,
			// 	this.endNode.y
			// );

			var pathString = this.paper.buildPath(
				new Playbook.Models.Coordinate(this.startNode.x, this.startNode.y),
				new Playbook.Models.Coordinate(this.endNode.x, this.endNode.y),
				this.width
			);

			this.path = new Playbook.Models.FieldElement(this);
			this.path.raphael = this.paper.path(pathString).attr({
				'fill': 'red',
				'title': this.title
			});

			return this.path;
		}

		public click(e: any, self: any): void {
			console.log('route path clicked');
		}
		public hoverIn(e: any, self: any): void { }
		public hoverOut(e: any, self: any): void { }
		public mousedown(e: any, self: any): any { }

		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void { }
		public dragStart(x: number, y: number, e: any): void { }
		public dragEnd(e: any): void { }

		public getSaveData(): any { }
		public getBBoxCoordinates(): any { }

		public remove() {
			console.log('not implemented');
			//this.path.remove();
		}
	}
}