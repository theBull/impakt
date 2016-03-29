/// <reference path='../models.ts' />

module Playbook.Models {
    export class Field 
    implements Playbook.Interfaces.IField {

        public paper: Playbook.Interfaces.IPaper;
        public grid: Playbook.Interfaces.IGrid;
        public playPrimary: Playbook.Models.PlayPrimary;
        public playOpponent: Playbook.Models.PlayOpponent;
        public type: Playbook.Editor.UnitTypes;
        public editorType: Playbook.Editor.EditorTypes;
        public zoom: number;
        public players: Playbook.Models.PlayerCollection;
        public selectedPlayers: Playbook.Models.PlayerCollection;


        public ball: Playbook.Models.Ball;
        public los: Playbook.Models.LineOfScrimmage;
        public ground: Playbook.Models.Ground;
        public endzone_top: Playbook.Models.Endzone;
        public endzone_bottom: Playbook.Models.Endzone;
        public sideline_left: Playbook.Models.Sideline;
        public sideline_right: Playbook.Models.Sideline;
        public hashmark_left: Playbook.Models.Hashmark;
        public hashmark_right: Playbook.Models.Hashmark;
        public hashmark_sideline_left: Playbook.Models.Hashmark;
        public hashmark_sideline_right: Playbook.Models.Hashmark;

        constructor(paper, playPrimary, playOpponent) {
            this.paper = paper;
            this.grid = this.paper.grid;
            this.playPrimary = playPrimary;
            this.playOpponent = playOpponent;
            this.type = this.playPrimary.unitType;
            this.editorType = this.playPrimary.editorType;
            this.zoom = 1;
            this.players = new Playbook.Models.PlayerCollection();
            this.selectedPlayers = new Playbook.Models.PlayerCollection();
            /**
             * Ensure intialization of the field is complete before attempting
             * to initialize any field elements.
             */
            /**
             * TODO @theBull - refactor all of these drawing commands to a layers
             * collection.
             */
            this.ball = new Playbook.Models.Ball(this);
            this.ground = new Playbook.Models.Ground(this);
            this.los = new Playbook.Models.LineOfScrimmage(this);
            this.endzone_top = new Playbook.Models.Endzone(this, 0);
            this.endzone_bottom = new Playbook.Models.Endzone(this, 110);
            this.sideline_left = new Playbook.Models.Sideline(this, -25);
            this.sideline_right = new Playbook.Models.Sideline(this, 25);
            this.hashmark_left = new Playbook.Models.Hashmark(this, -3);
            this.hashmark_right = new Playbook.Models.Hashmark(this, 3);
            this.hashmark_sideline_left = new Playbook.Models.Hashmark(this, -25);
            this.hashmark_sideline_right = new Playbook.Models.Hashmark(this, 25);
        }
        public draw () {
            let self = this;
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
        };
        public clearPlay () {
            this.players.forEach(function(player, index) {
                player.clear();
            });
            this.players.removeAll();
            this.playPrimary = null;
            this.playOpponent = null;
        };
        public drawPlay () {
            // draw the play data onto the field
            if (this.playPrimary)
                this.playPrimary.draw(this);
            // draw the opponent play data onto the field
            if (this.playOpponent)
                this.playOpponent.draw(this);
        };
        public updatePlay (playPrimary, playOpponent) {
            this.clearPlay();
            this.playPrimary = playPrimary;
            this.playOpponent = playOpponent;
            this.drawPlay();
        };
        public useAssignmentTool (coords: Playbook.Models.Coordinates) {
            if (this.selectedPlayers.size() == 1) {
                let player = this.selectedPlayers.getOne();
                // initialize a new route, ensures a route is available
                // for the following logic.
                if (player.assignment.routes &&
                    player.assignment.routes.size() == 0) {
                    let route = new Playbook.Models.Route(player);
                    player.assignment.routes.add(route);
                }
                // TODO: this will only get the first route, implement
                // route switching
                let playerRoute = player.assignment.routes.getOne();
                if (playerRoute.dragInitialized)
                    return;
                // route exists, append the node
                playerRoute.addNode(coords);
                console.log('set player route', player.label, playerRoute);
                this.playPrimary.assignments.addAtIndex(player.assignment, player.position.index);
            }
            else if (this.selectedPlayers.size() <= 0) {
                console.log('select a player first');
            }
            else {
                console.log('apply routes in bulk...?');
            }
        };
        public export () {
            return null;
        };
        public placeAtYardline (element, yardline) {
        };
        public remove () { };
        public getBBoxCoordinates () { };
        public addPlayer (
            placement: Playbook.Models.Placement, 
            position: Playbook.Models.Position, 
            assignment: Playbook.Models.Assignment
        ): Playbook.Interfaces.IPlayer {
            let player = new Playbook.Models.Player(this, placement, position, assignment);
            player.draw();
            this.players.add(player);
            return player;
        };
        public getPlayerWithPositionIndex (index) {
            let matchingPlayer = this.players.filterFirst(function(player) {
                return player.hasPosition() && (player.position.index == index);
            });
            return matchingPlayer;
        };
        public applyPrimaryPlay (play) {
            throw new Error('field applyPrimaryPlay() not implemented');
        };
        public applyPrimaryFormation (formation) {
            //console.log(formation);
            // the order of placements within the formation get applied straight across
            // to the order of personnel and positions.
            let self = this;
            this.players.forEach(function(player, index) {
                // NOTE: we're not using the index from the forEach callback,
                // because we can't assume the players collection stores the players
                // in the order according to the player's actual index property
                let playerIndex = player.position.index;
                if (playerIndex < 0) {
                    throw new Error('Player must have a position index');
                }
                let newPlacement = formation.placements.getIndex(playerIndex);
                if (!newPlacement) {
                    throw new Error('Updated player placement is invalid');
                }
                player.updatePlacement(newPlacement);
                player.draw();
            });
            // update the field play formation
            this.playPrimary.setFormation(formation);
            // TODO @theBull - implement set formation for opponent formation
        };
        public applyPrimaryAssignments (assignments) {
            let self = this;
            if (assignments.hasElements()) {
                assignments.forEach(function(assignment, index) {
                    let player = self.getPlayerWithPositionIndex(assignment.positionIndex);
                    if (player) {
                        assignment.setContext(player);
                        player.assignment.erase();
                        player.assignment = assignment;
                        player.draw();
                    }
                });
                // TODO @theBull - implement apply opponent assignments
                this.playPrimary.setAssignments(assignments);
            }
        };
        public applyPrimaryPersonnel (personnel) {
            let self = this;
            if (personnel && personnel.hasPositions()) {
                this.players.forEach(function(player, index) {
                    let newPosition = personnel.positions.getIndex(index);
                    if (self.playPrimary.personnel &&
                        self.playPrimary.personnel.hasPositions()) {
                        self.playPrimary.personnel.positions.getIndex(index).fromJson(newPosition.toJson());
                    }
                    player.position.fromJson(newPosition.toJson());
                    player.draw();
                });
                // TODO @theBull - implement apply opponent assignments
                this.playPrimary.setPersonnel(personnel);
            }
            else {
                let details = personnel ? '# positions: ' + personnel.positions.size() : 'Personnel is undefined.';
                alert([
                    'There was an error applying this personnel group. ',
                    'Please inspect it in the Team Management module. \n\n',
                    details
                ].join(''));
            }
        };
        public deselectAll () {
            if (this.selectedPlayers.size() == 0)
                return;
            this.selectedPlayers.removeEach(function(player, key) {
                // will effectively tell the player to de-select itself
                player.select();
            });
            //console.log('All players de-selected', this.selectedPlayers);
        };
        public togglePlayerSelection (player) {
            // TODO - support alt/cmd/ctrl/shift selection
            // clear any selected players
            this.selectedPlayers.forEach(function(player, key) {
                player.select(false);
            });
            this.selectedPlayers.removeAll();
            player.select();
            if (this.selectedPlayers.contains(player.guid)) {
                this.selectedPlayers.remove(player.guid);
            }
            else {
                this.selectedPlayers.add(player);
            }
            //console.log(this.selectedPlayers);
        };
    }
}
