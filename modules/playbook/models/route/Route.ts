/// <reference path='../models.ts' />

module Playbook.Models {

	export class Route
		extends Common.Models.Modifiable {

		public player: Playbook.Interfaces.IPlayer;
		public paper: Playbook.Interfaces.IPaper;
		public grid: Playbook.Interfaces.IGrid;
		public field: Playbook.Interfaces.IField;
		
		public path: Playbook.Models.FieldElement;
		public set: Playbook.Models.FieldElementSet;
		public nodes: Common.Models.ModifiableLinkedList<Playbook.Models.RouteNode>;
		public color: string;
		public dragInitialized: boolean;

		constructor(
			player: Playbook.Interfaces.IPlayer, 
			dragInitialized?: boolean
		) {
			this.player = player;
			this.paper = this.player.paper;
			this.grid = this.paper.grid;
			
			super(this);			

			if(player) {
			
				this.nodes = new Common.Models.ModifiableLinkedList<Playbook.Models.RouteNode>();

				// add root node
				let root = this.addNode(
					this.player.placement.getCoordinates(),
					Playbook.Models.RouteNodeType.Root,
					false
				);
				root.data.disabled = true;
			}

			this.dragInitialized = dragInitialized === true;
			this.path = new Playbook.Models.FieldElement(this);
			this.color = 'black';
		}

		public setContext(player: Playbook.Interfaces.IPlayer) {
			if (player) {
				this.player = player;
				this.grid = this.player.grid;
				this.field = this.player.field;
				this.paper = this.player.paper;

				let self = this;
				this.nodes.forEach(function(node, index) {
					node.data.setContext(self);

					// Pushing this onto the fieldElementSet maintained
					// by 'self.context', which is a Player. This fieldElementSet
					// is a Raphael set, which allows bulk transformations.
					if(!self.player.set.getByGuid(node.data.guid)) {
						self.player.set.push(node.data);
					}
				});
				this.draw();
			}
		}

		public fromJson(json: any) {

			this.dragInitialized = json.dragInitialized;
			this.guid = json.guid;
			
			// initialize route nodes
			if (json.nodes) {
				for (let i = 0; i < json.nodes.length; i++) {
					let rawNode = json.nodes[i];
					let coords = new Playbook.Models.Coordinate(rawNode.x, rawNode.y);
					let routeNodeModel = new Playbook.Models.RouteNode(null, coords, rawNode.type);
					routeNodeModel.fromJson(rawNode);
					this.addNode(routeNodeModel.getCoordinates(), routeNodeModel.type, false);

				}
			}
		}

		public toJson(): any {
			return {
				nodes: this.nodes.toJson(),
				guid: this.guid,
				dragInitialized: this.dragInitialized
			};
		}

		public erase() {
			this.paper.remove(this.path.raphael);
			this.nodes.forEach(function(node, index) {
				node.data.erase();
			});
		}

		public draw() {
			if (!this.player) {
				throw new Error('Route player is not set');
			}
			let pathStr = this.getMixedStringFromNodes(this.nodes.toArray());
			console.log(pathStr);

			this.paper.remove(this.path.raphael);

			this.path.raphael = this.paper.path(pathStr).attr({
				'stroke': this.color,
				'stroke-width': 2
			});
			this.path.raphael.node.setAttribute('class', 'painted-fill');
			this.player.set.exclude(this.path);
			this.player.set.push(this.path);
		}

		public clear(): void {
			this.paper.remove(this.path.raphael);
			// this.nodes.forEach(function(node, index) {
			// 	if(node && node.data)
			// 		node.data.clear();
			// });
		}

		public drawCurve(node: Playbook.Models.RouteNode) {
			if (!this.player) {
				throw new Error('Route player is not set');
			}
			if (node) {
				//node.drawControlPaths();
			}

			// update path
			let dataArray = this.nodes.toDataArray<Playbook.Models.FieldElement>();
			let pathStr = this.paper.getCurveStringFromNodes(
				true, dataArray
			);
			this.paper.remove(this.path.raphael);

			this.path.raphael = this.paper.path(pathStr).attr({
				'stroke': this.color,
				'stroke-width': 2
			});
			this.path.raphael.node.setAttribute('class', 'painted-fill');
			this.player.set.exclude(this.path);
			this.player.set.push(this.path);
		}

		public drawLine() {
			if (!this.player) {
				throw new Error('Route player is not set');
			}
			let pathStr = this.paper.getPathStringFromNodes(
				true,
				this.nodes.toDataArray<Playbook.Models.FieldElement>()
			);

			this.paper.remove(this.path.raphael);

			this.path.raphael = this.paper.path(pathStr).attr({
				'stroke': this.color,
				'stroke-width': 2
			});
			this.path.raphael.node.setAttribute('class', 'painted-fill');
			this.player.set.exclude(this.path);
			this.player.set.push(this.path);
		}

		public initializeCurve(coords: Playbook.Models.Coordinate, flip: boolean) {
			// if(coords.x != this.player.x && coords.y != this.player.y) {
			// 	console.log('draw curve');
			// }

			// pre-condition: we do not have < 1 nodes, since we
			// always create a node when we initialize the object.

			// TODO: if there are more than 3 nodes?
			if (this.nodes.size() == 0 || this.nodes.size() > 3) {
				// ignore this command if assignment node list is empty
				// or if there are more than 3 nodes (TODO)
				return;
			}

			let control, end;
			if (this.nodes.size() == 1) {

				if (this.nodes.root && this.nodes.root.data) {
					this.nodes.root.data.type = Playbook.Models.RouteNodeType.CurveStart;
				}
				else {
					throw new Error('could not initialize curve; root is invalid');
				}

				// we only have a root node (start node);
				// add control node and end node;
				// initially, control and end nodes will
				// share the same coords
				control = this.addNode(
					new Playbook.Models.Coordinate(
						this.nodes.root.data.x,
						this.nodes.root.data.y
					),
					Playbook.Models.RouteNodeType.CurveControl,
					false
				); // false: do not render

				end = this.addNode(
					this.grid.getGridCoordinatesFromPixels(coords),
					Playbook.Models.RouteNodeType.CurveEnd,
					false
				); // false: do not render

				//this.context.set.push(control.data, end.data);
			}


			if (!this.nodes || !this.nodes.root || !this.nodes.root.data)
				throw new Error('failed to get control and end nodes');

			// get control and end nodes
			control = this.nodes.getIndex(1);
			console.log(
				'root: ',
				flip,
				this.nodes.root.data,
				this.nodes.root.data.ax,
				this.nodes.root.data.ay
			);

			if (flip) {
				control.data.ax = coords.x;
				control.data.ay = this.nodes.root.data.ay;
			} else {
				control.data.ax = this.nodes.root.data.ax;
				control.data.ay = coords.y;
			}
			control.data.ox = control.data.ax;
			control.data.oy = control.data.ay;
			let controlGridCoords = this.grid.getGridCoordinatesFromPixels(
				new Playbook.Models.Coordinate(control.data.ax, control.data.ay)
			);
			control.data.x = controlGridCoords.x;
			control.data.y = controlGridCoords.y;
			if (control.data.raphael) {
				control.data.raphael.attr({
					cx: control.data.ax,
					cy: control.data.ay
				});
			}

			end = this.nodes.getIndex(2);
			end.data.ax = coords.x;
			end.data.ay = coords.y;
			end.data.ox = end.data.ax;
			end.data.oy = end.data.ay;
			let endGridCoords = this.grid.getGridCoordinatesFromPixels(
				new Playbook.Models.Coordinate(end.data.ax, end.data.ay)
			);
			end.data.x = endGridCoords.x;
			end.data.y = endGridCoords.y;
			if (end.data.raphael) {
				end.data.raphael.attr({
					cx: end.data.ax,
					cy: end.data.ay
				});
			}

			// control node follows y value of cursor
			// update control node
			//control.node.setCoordinate(new Playbook.Editor.Coordinate(0, coords.y));

			// end node follows x,y value of cursor
			// update end node

			this.drawCurve(control.data);
		}

		public addNode(
			coords: Playbook.Models.Coordinate,
			type?: Playbook.Models.RouteNodeType,
			render?: boolean)
			: Common.Models.LinkedListNode<Playbook.Models.RouteNode> {
			//let fromNode = this.getLastNode();
			
			let routeNodeType = type || (
				this.nodes.hasElements() ? 
				Playbook.Models.RouteNodeType.Normal : 
				Playbook.Models.RouteNodeType.Root
			);
			let routeNode = new Playbook.Models.RouteNode(
				this, coords, routeNodeType
			);
			// let self = this;
			// routeNode.onModified(function(data: any) {
			// 	self.generateChecksum();
			// });
			let node = new Common.Models.LinkedListNode(
				routeNode,
				null
			);

			this.nodes.add(node);
			
			this.player.set.push(node.data);
			if (render !== false) {
				node.data.draw();
				//this.player.set.push(node.data);
				this.draw();
			}
			return node;
		}

		public getLastNode(): Playbook.Models.FieldElement {
			//return this.nodes.getLast<Playbook.Models.FieldElement>();
			return null;
		}

		public getMixedStringFromNodes(
			nodeArray: Common.Models.LinkedListNode<Playbook.Models.RouteNode>[])
			: string {
			if (!nodeArray || nodeArray.length == 0) {
				throw new Error('Cannot get mixed path string on empty node array');
			}

			// must always have at least 2 nodes
			if (nodeArray.length == 1) {
				return '';
			}

			let str = '';
			for (let i = 0; i < nodeArray.length; i++) {
				let node = nodeArray[i];

				if (!node.next) {
					// just in case
					break;
				}

				// must always have at least 2 nodes
				let type = node.data.type;
				let nextType = node.next.data.type;

				if (type == Playbook.Models.RouteNodeType.CurveStart) {

					if (nextType != Playbook.Models.RouteNodeType.CurveControl) {
						throw new Error(
							'A curve start node must be followed by a curve control node'
						);
					}

					// Good: next node is curve control

					// check for 2 subsequent nodes
					if (!node.next.next) {
						throw new Error('a curve must have a control and end node');
					}
					let endType = node.next.next.data.type;
					if (endType != Playbook.Models.RouteNodeType.CurveEnd) {
						throw new Error(
							'A curve must end with a curve end node'
						);
					}

					str += this.paper.getCurveStringFromNodes(true, [
						node.data, // start
						node.next.data,  // control
						node.next.next.data // next (end)
					]);

					i++;

				}
				else if (type == Playbook.Models.RouteNodeType.CurveEnd) {
					if (i == 0) {
						throw new Error('curveEnd node cannot be the first node');
					}
					if (nextType == Playbook.Models.RouteNodeType.CurveControl) {
						// check for 2 subsequent nodes
						if (!node.next.next) {
							throw new Error('a curve must have a control and end node');
						}

						let endType = node.next.next.data.type;
						if (endType != Playbook.Models.RouteNodeType.CurveEnd) {
							throw new Error(
								'A curve must end with a curve end node'
							);
						}

						str += this.paper.getCurveStringFromNodes(false, [
							node.data, // start
							node.next.data,  // control
							node.next.next.data // next (end)
						]);

						i++;

					} else {
						// next node is normal node
						str += this.paper.getPathStringFromNodes(false, [
							node.data,
							node.next.data
						]);
					}
				}

				// TODO: other conditions?
				else {
					// assuming we are drawing a straight path
					
					str += this.paper.getPathStringFromNodes(i == 0, [
						node.data,
						node.next.data
					]);

				}
			}
			return str;
		}

		public moveNodesByDelta(dx: number, dy: number) {
			this.nodes.forEach(function(node, index) {
				if (node && node.data) {
					node.data.moveByDelta(dx, dy);
				}
			});
		}
	}

}

module Playbook.Editor {
	export enum RouteTypes {
		None,
		Block,
		Scan,
		Run,
		Route,
		Cover,
		Zone,
		Spy,
		Option,
		HandOff,
		Pitch
	}
}
