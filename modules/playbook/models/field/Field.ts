/// <reference path='../models.ts' />

module Playbook.Models {
	export class Field extends FieldElement 
		implements Playbook.Interfaces.IFieldContext {

		public ground: Playbook.Models.FieldElement;
		public ball: Playbook.Models.Ball;
		public los: Playbook.Models.LineOfScrimmage;
		public endzone_top: Playbook.Models.Endzone;
		public endzone_bottom: Playbook.Models.Endzone;
		public hashmark_left: Playbook.Models.Hashmark;
		public hashmark_right: Playbook.Models.Hashmark;
		public sideline_left: Playbook.Models.Sideline;
		public sideline_right: Playbook.Models.Sideline;
		public type: Playbook.Editor.UnitTypes;
		public editorType: Playbook.Editor.EditorTypes;
		public play: Playbook.Models.Play;
		public zoom: number;
		public playData: any; // todo
		public id: number;
		public players: Playbook.Models.PlayerCollection;
		public selectedPlayers: Playbook.Models.PlayerCollection;
		public opacity: number;
		public offset: Playbook.Models.Coordinate;
		public clickDisabled: boolean;

		constructor(
			context: Playbook.Models.Canvas,
			play: Playbook.Models.Play
		) {
			console.log('creating field');
			super(context, context);
			
			this.canvas = context;
			this.play = play;
			this.type = this.play.type;
			this.editorType = this.play.editorType;
			this.paper = this.canvas.paper;
			this.grid = this.canvas.grid;

			this.ground = new Playbook.Models.FieldElement(this);
			this.ball = new Playbook.Models.Ball(this);
			this.los = new Playbook.Models.LineOfScrimmage(this);
			this.endzone_top = new Playbook.Models.Endzone(this, 0);
			this.endzone_bottom = new Playbook.Models.Endzone(this, 110);
			this.sideline_left = new Playbook.Models.Sideline(this, -25);
			this.sideline_right = new Playbook.Models.Sideline(this, 25);
			this.hashmark_left = new Playbook.Models.Hashmark(this, -8);
			this.hashmark_right = new Playbook.Models.Hashmark(this, 8);
			this.zoom = 1;
			this.playData = {};
			this.id = Common.Utilities.randomId();
			this.players = new Playbook.Models.PlayerCollection();
			this.selectedPlayers = new Playbook.Models.PlayerCollection();
			this.offset = new Playbook.Models.Coordinate(0, 0);

			this.opacity = 0.1;
			this.clickDisabled = false;
		}

		public draw(): any {
			let self = this;

			this.endzone_top.draw();
			this.endzone_bottom.draw();

			this.sideline_left.draw();
			this.sideline_right.draw();

			this.hashmark_left.draw();
			this.hashmark_right.draw();

			// draws a border around the field
			this.ground.raphael = this.paper.rect(
				0, // offset for sideline 
				0, 
				// subtract spacing for sidelines
				this.grid.GRIDSIZE * this.canvas.cols,
				this.paper.height
			).attr({
				'fill': '#113311',
				'opacity': self.opacity
			});
			this.ground.click(this.click, this);

			this.ground.drag(
				this.dragMove,
				this.dragStart,
				this.dragEnd,
				this, this, this
			);

			this.los.draw();

			//this.ball.draw();

			// debugging
			// this.paper.circle(25, 60, 3).attr({ 'fill': 'red' });

			//this.paper.centerView(this.grid);
			
			// draw the editor data onto the field
			this.play.draw(this);
	
		}

		public placeAtYardline(element: FieldElement, yardline: number) {
			
		}
		public setOffset(offsetX: number, offsetY: number) {
			this.offset.x = offsetX;
			this.offset.y = offsetY;
			console.log('updated field cursor offset position', 
				this.offset,
				this.getCoordinates()
			);
		}
		public getCoordinates()
			: Playbook.Models.Coordinate
		{
			return this.grid.getGridCoordinatesFromPixels(
				new Playbook.Models.Coordinate(
					this.offset.x - Math.abs(this.paper.x),
					Math.abs(this.paper.y) + this.offset.y
				)
			);
		}
		
		public remove() {}

		public click(e: any, self: any): void {

			self.setOffset(e.offsetX, e.offsetY);
			let coords = self.getCoordinates();

			console.log(
				'field clicked',
				self.clickDisabled ? 'disabled' : 'enabled',
				e, 
				coords);			
			
			let editorMode = self.canvas.editorMode;
			switch(editorMode) {
				case Playbook.Editor.EditorModes.Select:
					console.log('selection mode');
					self.deselectAll();
					break;	
				case Playbook.Editor.EditorModes.None:
					console.log('no mode');
					self.deselectAll();
					break;
				case Playbook.Editor.EditorModes.Assignment:

					if (self.selectedPlayers.size() == 1) {
						let player = self.selectedPlayers.getOne();

						// initialize a new route, ensures a route is available
						// for the following logic.
						if (player.assignment.routes && 
							player.assignment.routes.size() == 0) {

							let route = new Playbook.Models.Route(player);
							player.assignment.routes.add(route.guid, route);
						}

						// TODO: this will only get the first route, implement
						// route switching
						let playerRoute = player.assignment.routes.getOne();

						if (playerRoute.dragInitialized)
							break;
							
						// route exists, append the node
						playerRoute.addNode(coords);
						
						console.log(
							'set player route',
							player.label,
							playerRoute
						);

						self.play.assignments.addAtIndex(
							player.assignment.guid, 
							player.assignment,
							player.position.index
						);			
						
					} else if (self.selectedPlayers.size() <= 0) {
						console.log('select a player first');
					} else {
						console.log('apply routes in bulk...?');
					}
					break;
			}
			
		}
		public hoverIn(e: any, self: any): void { }
		public hoverOut(e: any, self: any): void { }
		public mouseDown(e: any, self: any): any { 
			self.setOffset(e.offsetX, e.offsetY);
		}

		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void { 
			console.log('field drag', dx, dy, posx, posy);
		}
		public dragStart(x: number, y: number, e: any): void { 
		}
		public dragEnd(e: any): void { 
		}

		public getBBoxCoordinates(): any { }

		public getPositionRelativeToBall(from: FieldElement)
			: Playbook.Models.RelativePosition {
			return this.getPositionRelativeToElement(from, this.ball);
		}

		public getPositionRelativeToElement(
			from: FieldElement, to: FieldElement
		): Playbook.Models.RelativePosition {
			return null;
		}

		public getPositionRelativeToCoordinate(
			from: FieldElement, to: Playbook.Models.Coordinate
		): Playbook.Models.RelativePosition {
			return null;
		}

		public getPositionRelativeToWindow(from: FieldElement): 
			Playbook.Models.RelativePosition {
			return null;
		}

		public addPlayer(
			placement: Playbook.Models.Placement,
			position: Playbook.Models.Position,
			assignment: Playbook.Models.Assignment
		): Playbook.Models.Player {

			var player = new Playbook.Models.Player(
				this,
				placement,
				position,
				assignment
			);

			player.draw();
			
			this.players.add<Playbook.Models.Player>(player.guid, player);
			
			return player;
		}

		public getPlayerWithPositionIndex(index: number): Playbook.Models.Player {
			let matchingPlayer = this.players.filterFirst<Playbook.Models.Player>(
				function(player) {
					return player.hasPosition() && (player.position.index == index);
				});
			return matchingPlayer;
		}

		public applyFormation(formation: Playbook.Models.Formation) {
			console.log(formation);
			throw new Error('Field.applyFormation() not implemented...');
		}

		public applyAssignments(assignments: Playbook.Models.AssignmentCollection) {
			let self = this;
			if(assignments.hasAssignments()) {
				assignments.forEach(function(assignment, index) {
					let player = self.getPlayerWithPositionIndex(assignment.positionIndex);
					if(player) {
						assignment.setContext(player);

						player.assignment.erase();
						player.assignment = assignment;
						player.draw();
					}
				});
				this.play.assignments = assignments;
			}
		}

		public applyPersonnel(personnel: Playbook.Models.Personnel) {		
			let self = this;
			this.players.forEach(function(player, index) {
				let newPosition = personnel.positions.getIndex(index);
				if (self.play.personnel && self.play.personnel.hasPositions()) {
					self.play.personnel.positions.getIndex(index).fromJson(
						newPosition.toJson()
					);
				}
				player.position.fromJson(newPosition.toJson());
				player.draw();
			});

			this.play.personnel = personnel;
		}

		public deselectAll(): void {
			if (this.selectedPlayers.size() == 0)
				return;

			this.selectedPlayers.removeEach(function(player, key) {
				// will effectively tell the player to de-select itself
				player.select();
			});
			console.log('All players de-selected', this.selectedPlayers);
		}
		public togglePlayerSelection(player: Player): void {
			// TODO - support alt/cmd/ctrl/shift selection
			// clear any selected players
			this.selectedPlayers.forEach(function(player, key) {
				player.select(false);
			});
			this.selectedPlayers.removeAll();

			player.select();

			if(this.selectedPlayers.contains(player.guid)) {
				this.selectedPlayers.remove(player.guid);
			} else {
				this.selectedPlayers.add(player.guid, player);
			}
			
			console.log(this.selectedPlayers);
		}
	}
}