/// <reference path='./models.ts' />

module Playbook.Models {
    export class EditorField
    extends Common.Models.Field
    implements Common.Interfaces.IField {

        public type: Team.Enums.UnitTypes;
        public editorType: Playbook.Enums.EditorTypes;
        public zoom: number;

        constructor(
            paper: Common.Interfaces.IPaper, 
            playPrimary: Common.Models.PlayPrimary, 
            playOpponent: Common.Models.PlayOpponent
        ) {
            super(paper, playPrimary, playOpponent);

            this.type = this.playPrimary.unitType;
            this.editorType = this.playPrimary.editorType;
            this.zoom = 1;

            let self = this;
            window.setInterval(function() {
                self.debug(self);
            }, 1000);
            this.onModified(function() {
                console.log('field modified');
            });
        }

        public debug(context: Playbook.Models.EditorField) {
            let breakpoint = 1;
        }

        public initialize(): void {
            this.ball = new Playbook.Models.EditorBall(this);
            this.ground = new Playbook.Models.EditorGround(this);
            this.los = new Playbook.Models.EditorLineOfScrimmage(this);
            this.endzone_top = new Playbook.Models.EditorEndzone(this, 0);
            this.endzone_bottom = new Playbook.Models.EditorEndzone(this, 110);
            this.sideline_left = new Playbook.Models.EditorSideline(this, 0);
            this.sideline_right = new Playbook.Models.EditorSideline(this, 51);
            this.hashmark_left = new Playbook.Models.EditorHashmark(this, 22);
            this.hashmark_right = new Playbook.Models.EditorHashmark(this, 28);
            this.hashmark_sideline_left = new Playbook.Models.EditorHashmark(this, 2);
            this.hashmark_sideline_right = new Playbook.Models.EditorHashmark(this, 50);

            // Set containment around the ball to restrict its drag area
            this.ball.layer.graphics.setContainment(
                this.hashmark_left.layer.graphics.placement.coordinates.x,
                this.hashmark_right.layer.graphics.placement.coordinates.x,
                this.endzone_top.layer.graphics.dimensions.getHeight(),
                this.endzone_top.layer.graphics.placement.coordinates.y
            );

            this.layers.add(this.ball.layer);
            this.layers.add(this.ground.layer);
            this.layers.add(this.los.layer);
            this.layers.add(this.endzone_top.layer);
            this.layers.add(this.endzone_bottom.layer);
            this.layers.add(this.sideline_left.layer);
            this.layers.add(this.sideline_right.layer);
            this.layers.add(this.hashmark_left.layer);
            this.layers.add(this.hashmark_right.layer);
            this.layers.add(this.hashmark_sideline_left.layer);
            this.layers.add(this.hashmark_sideline_right.layer);

            if (!this.playPrimary.formation) {
                this.playPrimary.formation = new Common.Models.Formation('Default Formation');
                this.playPrimary.formation.setDefault(this.ball);
            }

            this.draw();
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
            this.drawPlay();
        }

        public useAssignmentTool (coords: Common.Models.Coordinates) {
            if (!this.selected.hasElements()) {
                console.error('Select a player first'); 
                return;
            }
            let selectedPlayers = this.getSelectedByLayerType(Common.Enums.LayerTypes.Player);
            if(selectedPlayers.hasElements()) {
                selectedPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                    if (player.assignment.routes &&
                        player.assignment.routes.size() == 0) {
                        let route = new Playbook.Models.EditorRoute(player);
                        player.assignment.routes.add(route);
                    }
                    // TODO: this will only get the first route, implement
                    // route switching
                    let playerRoute = player.assignment.routes.getOne();
                    if (playerRoute.dragInitialized)
                        return;

                    let newNode = new Playbook.Models.EditorRouteNode(
                        player,
                        new Common.Models.RelativeCoordinates(0, 0, player),
                        Common.Enums.RouteNodeTypes.Normal
                    );
                    // route exists, append the node
                    playerRoute.addNode(newNode);
                    console.log('set player route', player.relativeCoordinatesLabel, playerRoute);
                    this.playPrimary.assignments.addAtIndex(player.assignment, player.position.index);
                });
            }
        }
        public export () {
            return null;
        }
        public placeAtYardline (element, yardline) {
        }
        public remove () { }
        public getBBoxCoordinates () { }
        
        public addPlayer (
            placement: Common.Models.Placement, 
            position: Team.Models.Position, 
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer {
            
            let player = new Playbook.Models.EditorPlayer(
                this, 
                placement, 
                position, 
                assignment
            );
            
            player.draw();
            let self = this;
            player.onModified(function() {
                self.setModified(true);
                
                if(self.playPrimary) {
                    self.playPrimary.setModified(true);
                }

                if(self.playOpponent) {
                    self.playOpponent.setModified(true);
                }
            });
            this.players.add(player);
            return player;
        }
    }
}
