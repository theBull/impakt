/// <reference path='./models.ts' />

module Playbook.Models {
    export class EditorField
    extends Common.Models.Field
    implements Common.Interfaces.IField {

        public type: Team.Enums.UnitTypes;
        public zoom: number;

        constructor(
            canvas: Common.Interfaces.ICanvas
        ) {
            super(canvas);

            this.zoom = 1;

            let self = this;
            this.onModified(function() {
                //console.log('field modified');
            });
            this.state = Common.Enums.State.Constructed;
        }

        public initialize(): void {

            let setBallContainment = false;
            if(!this.ball) {
                this.ball = new Playbook.Models.EditorBall();
                this.ball.initialize(this, null);
                setBallContainment = true;
                this.layer.addLayer(this.ball.layer);
            }

            if(!this.ground) {
                this.ground = new Playbook.Models.EditorGround();
                this.ground.initialize(this, null);
                this.layer.addLayer(this.ground.layer);
            }

            if(!this.los) {
                this.los = new Playbook.Models.EditorLineOfScrimmage();
                this.los.initialize(this, null);
                this.layer.addLayer(this.los.layer);
            }
            
            if(!this.endzone_top) {
                this.endzone_top = new Playbook.Models.EditorEndzone(0);
                this.endzone_top.initialize(this, null);
                this.layer.addLayer(this.endzone_top.layer);
            }
            
            if(!this.endzone_bottom) {
                this.endzone_bottom = new Playbook.Models.EditorEndzone(110);
                this.endzone_bottom.initialize(this, null);
                this.layer.addLayer(this.endzone_bottom.layer);            
            }

            if(!this.sideline_left) {
                this.sideline_left = new Playbook.Models.EditorSideline(0);
                this.sideline_left.initialize(this, null);
                this.layer.addLayer(this.sideline_left.layer);
            }

            if(!this.sideline_right) {
                this.sideline_right = new Playbook.Models.EditorSideline(51);
                this.sideline_right.initialize(this, null);
                this.layer.addLayer(this.sideline_right.layer);
            }

            if(!this.hashmark_left) {
                this.hashmark_left = new Playbook.Models.EditorHashmark(22);
                this.hashmark_left.initialize(this, null);
                this.layer.addLayer(this.hashmark_left.layer);
            }

            if(!this.hashmark_right) {
                this.hashmark_right = new Playbook.Models.EditorHashmark(28);
                this.hashmark_right.initialize(this, null);
                this.layer.addLayer(this.hashmark_right.layer);
            }

            if(!this.hashmark_sideline_left) {
                this.hashmark_sideline_left = new Playbook.Models.EditorHashmark(2);
                this.hashmark_sideline_left.initialize(this, null);
                this.layer.addLayer(this.hashmark_sideline_left.layer);
            }

            if(!this.hashmark_sideline_right) {
                this.hashmark_sideline_right = new Playbook.Models.EditorHashmark(50);
                this.hashmark_sideline_right.initialize(this, null);
                this.layer.addLayer(this.hashmark_sideline_right.layer);
            }

            if(setBallContainment) {
                // Set containment around the ball to restrict its drag area
                this.ball.graphics.setContainment(
                    this.hashmark_left.graphics.placement.coordinates.x,
                    this.hashmark_right.graphics.placement.coordinates.x,
                    this.endzone_top.graphics.dimensions.getHeight(),
                    this.endzone_top.graphics.placement.coordinates.y
                );
            }

            this.draw();

            this.invokeListener('onready');
            this.state = Common.Enums.State.Ready;
        }

        public draw () {
            this.ground.draw();
            this.grid.draw();
            this.endzone_top.draw();
            this.endzone_bottom.draw();
            this.sideline_left.draw();
            this.sideline_right.draw();
            this.hashmark_left.draw();
            this.hashmark_right.draw();
            this.hashmark_sideline_left.draw();
            this.hashmark_sideline_right.draw();
            this.los.draw();
            this.ball.draw();
        }

        public useAssignmentTool (coords: Common.Models.Coordinates) {
            if (!this.selectedElements.hasElements()) {
                console.error('Select a player first'); 
                return;
            }

            // NOTE:
            // this method will return PRIMARY PLAYERS only.
            // This means that drawing routes on opponent players would not be possible
            // at this point.
            // 
            // TODO @theBull - implement checking for opponent players.
            let selectedPlayers = this.getSelectedByLayerType(Common.Enums.LayerTypes.PrimaryPlayer);

            let self = this;
            let relativeCoords = null;
            
            if(selectedPlayers.size() > 1) {
                selectedPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                    if(index == 0) {
                        relativeCoords = player.graphics.placement.coordinates.getRelativeTo(coords, player);
                    } else {
                        relativeCoords.relativeElement = player;
                    }
                    self._addAssignmentToPlayer.call(self, player, relativeCoords);
                });
            } else if(selectedPlayers.size() == 1) {
                let player = <Common.Interfaces.IPlayer>selectedPlayers.first();
                this._addAssignmentToPlayer(player, player.graphics.placement.coordinates.getRelativeTo(coords, player));
            }
        }

        private _addAssignmentToPlayer(player: Common.Interfaces.IPlayer, relativeCoords: Common.Models.RelativeCoordinates) {
            if (player.assignment &&
                player.assignment.routes &&
                player.assignment.routes.size() == 0) {
                let route = new Playbook.Models.EditorRoute();
                route.setPlayer(player);
                route.flipped = player.flipped;
                player.assignment.addRoute(route);
            }

            if(player.assignment && 
                !player.layer.containsLayer(player.assignment.layer)) {
                player.layer.addLayer(player.assignment.layer);
            }
            
            // TODO: this will only get the first route, implement
            // route switching
            let playerRoute = player.assignment.routes.getOne();

            // if the user is dragging while adding assignment, the
            // assignment route will be dynamically drawn; stop here,
            // do not place a node yet.
            if (playerRoute.dragInitialized)
                return;

            // Standard functionality - add a node where the click occurred
            let newNode = new Playbook.Models.EditorRouteNode(
                relativeCoords,
                Common.Enums.RouteNodeTypes.Normal
            );
            newNode.initialize(this, player);

            // route exists, append the node
            playerRoute.addNode(newNode);

            player.assignment.updateRouteArray();

            this.scenario.playPrimary.assignmentGroup.assignments.addAtIndex(
                player.assignment,
                player.position.index
            );    
        }

        public export () {
            return null;
        }
        public placeAtYardline (element, yardline) {
        }
        public remove () { }
        public getBBoxCoordinates () { }
        
        public addPrimaryPlayer (
            placement: Common.Models.Placement, 
            position: Team.Models.Position, 
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer {
            
            let player = new Playbook.Models.EditorPlayer(
                placement, 
                position, 
                assignment
            );
            player.initialize(this);
            player.draw();
            player.layer.type = Common.Enums.LayerTypes.PrimaryPlayer;

            
            let self = this;
            player.onModified(function() {
                self.setModified(true);
                
                if(self.scenario.playPrimary) {
                    self.scenario.playPrimary.setModified(true);
                }

                if(self.scenario.playOpponent) {
                    self.scenario.playOpponent.setModified(true);
                }
            });
            this.primaryPlayers.add(player);
            return player;
        }
        
        public addOpponentPlayer (
            placement: Common.Models.Placement, 
            position: Team.Models.Position, 
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer {
            
            let player = new Playbook.Models.EditorPlayer(
                placement, 
                position, 
                assignment
            );
            player.initialize(this);
            player.draw();
            player.layer.type = Common.Enums.LayerTypes.OpponentPlayer;
            
            let self = this;
            player.onModified(function() {
                self.setModified(true);
                
                if(self.scenario.playPrimary) {
                    self.scenario.playPrimary.setModified(true);
                }

                if(self.scenario.playOpponent) {
                    self.scenario.playOpponent.setModified(true);
                }
            });
            this.opponentPlayers.add(player);
            return player;
        }
    }
}
