/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Field
    extends Common.Models.Modifiable {

        public paper: Common.Interfaces.IPaper;
        public grid: Common.Interfaces.IGrid;
        public playPrimary: Common.Models.PlayPrimary;
        public playOpponent: Common.Models.PlayOpponent;
        public players: Common.Models.PlayerCollection;
        public selected: Common.Models.Collection<Common.Interfaces.IFieldElement>;
        public layers: Common.Models.LayerCollection;
        public cursorCoordinates: Common.Models.Coordinates;

        public ball: Common.Interfaces.IBall;
        public ground: Common.Interfaces.IGround;
        public los: Common.Interfaces.ILineOfScrimmage;
        public endzone_top: Common.Interfaces.IEndzone;
        public endzone_bottom: Common.Interfaces.IEndzone;
        public sideline_left: Common.Interfaces.ISideline;
        public sideline_right: Common.Interfaces.ISideline;
        public hashmark_left: Common.Interfaces.IHashmark;
        public hashmark_right: Common.Interfaces.IHashmark;
        public hashmark_sideline_left: Common.Interfaces.IHashmark;
        public hashmark_sideline_right: Common.Interfaces.IHashmark;

        constructor(
            paper: Common.Interfaces.IPaper, 
            playPrimary: Common.Models.PlayPrimary, 
            playOpponent: Common.Models.PlayOpponent
        ) {
            super();
            super.setContext(this);
            
            this.paper = paper;
            this.grid = this.paper.grid;
            this.playPrimary = playPrimary;
            this.playOpponent = playOpponent;
            this.players = new Common.Models.PlayerCollection();
            this.selected = new Common.Models.Collection<Common.Interfaces.IFieldElement>();
            this.layers = new Common.Models.LayerCollection();
            this.cursorCoordinates = new Common.Models.Coordinates(0, 0);

            let self = this;
            this.selected.onModified(function() {
                self.setModified(true);
            });

            this.players.onModified(function() {
                //self.updatePlacements();
                self.setModified(true);
            });

            this.onModified(function() {
            });
        }

        public abstract initialize(): void;

        /**
         * 
         * ABSTRACT METHODS
         * 
         */

        public abstract addPlayer(
            placement: Common.Models.Placement,
            position: Team.Models.Position,
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer;
        public abstract useAssignmentTool(coords: Common.Models.Coordinates);

        public registerLayer(layer: Common.Models.Layer) {
            this.layers.add(layer);
        }

        public draw(): void {
            this.ground.draw();
            this.grid.draw();
            this.los.draw();
            this.ball.draw();
            this.drawPlay();
        }
        public clearPlayers(): void {
            this.players.forEach(function(player, index) {
                player.layer.remove();
                if(Common.Utilities.isNotNullOrUndefined(player.assignment)) {
                    player.assignment.routes.forEach(function(route: Common.Interfaces.IRoute, index: number) {
                        route.layer.remove();
                    });
                }
            });
            this.players.removeAll();
        }
        public clearPlay(): void {
            this.clearPlayers();
            this.playPrimary = null;
            this.playOpponent = null;
        }
        public drawPlay(): void {
            // draw the play data onto the field
            if (this.playPrimary)
                this.playPrimary.draw(this);
            // draw the opponent play data onto the field
            if (this.playOpponent)
                this.playOpponent.draw(this);

            //this.updatePlacements();
        }
        public updatePlay(
            playPrimary: Common.Models.PlayPrimary, 
            playOpponent: Common.Models.PlayOpponent
        ): void {
            this.clearPlay();
            this.playPrimary = playPrimary;
            this.playOpponent = playOpponent;
            this.drawPlay();
            this.updatePlacements();
        }
        public updatePlacements(): void {
            let self = this;
            let placementCollection = new Common.Models.PlacementCollection();
            this.players.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                placementCollection.add(player.icon.graphics.placement);
            });
            self.playPrimary.formation.setPlacements(placementCollection);
        }

        public setCursorCoordinates(offsetX: number, offsetY: number): void {
            this.cursorCoordinates = this.grid.getCursorPositionCoordinates(offsetX, offsetY);
            this.setModified(true);
        }
        
        public getPlayerWithPositionIndex(index: number): Common.Interfaces.IPlayer {
            let matchingPlayer = this.players.filterFirst(function(player) {
                return player.hasPosition() && (player.position.index == index);
            });
            return matchingPlayer;
        }

        public applyPrimaryPlay(play: any): void {
            throw new Error('field applyPrimaryPlay() not implemented');
        }

        public applyPrimaryFormation(formation: Common.Models.Formation): void {
            if (Common.Utilities.isNullOrUndefined(formation))
                return;

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
                player.setPlacement(newPlacement);
                player.draw();
            });
            // update the field play formation
            this.playPrimary.setFormation(formation);
            // TODO @theBull - implement set formation for opponent formation
        }

        public applyPrimaryAssignmentGroup(assignmentGroup: Common.Models.AssignmentGroup): void {
            if (Common.Utilities.isNullOrUndefined(assignmentGroup))
                return;

            let self = this;
            if (assignmentGroup.assignments.hasElements()) {
                assignmentGroup.assignments.forEach(function(assignment, index) {
                    if (Common.Utilities.isNullOrUndefined(assignment))
                        return;
                    
                    let player = self.getPlayerWithPositionIndex(assignment.positionIndex);
                    if (player) {
                        assignment.setContext(player);
                        player.assignment.remove();
                        player.assignment = assignment;
                        player.draw();
                    }
                });
                // TODO @theBull - implement apply opponent assignments
                this.playPrimary.setAssignmentGroup(assignmentGroup);
            }
        }
        public applyPrimaryPersonnel(personnel: Team.Models.Personnel): void {
            if (Common.Utilities.isNullOrUndefined(personnel))
                return;

            
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
        }

        public applyPrimaryUnitType(unitType: Team.Enums.UnitTypes): void {
            if (Common.Utilities.isNullOrUndefined(unitType))
                return;

            if (Common.Utilities.isNullOrUndefined(this.playPrimary))
                return;

            this.playPrimary.setUnitType(unitType);
            
            if(Common.Utilities.isNotNullOrUndefined(this.playOpponent))
                this.playOpponent.setUnitType(this.playPrimary.getOpposingUnitType());
            
            this.clearPlayers();
            this.drawPlay();
        }
        
        public deselectAll(): void {
            if (this.selected.isEmpty())
                return;
            
            this.selected.forEach(function(element: Common.Interfaces.IFieldElement, index: number) {
                element.deselect();
            });
            this.selected.removeAll();
        }

        public getSelectedByLayerType(layerType: Common.Enums.LayerTypes)
        : Common.Models.Collection<Common.Interfaces.IFieldElement> {
            let collection = new Common.Models.Collection<Common.Interfaces.IFieldElement>();
            this.selected.forEach(function(selectedElement: Common.Interfaces.IFieldElement, index: number) {
                if(selectedElement.layer.type == layerType) {
                    collection.add(selectedElement);
                }
            });
            return collection;
        }

        public toggleSelectionByLayerType(layerType: Common.Enums.LayerTypes): void {
            let selectedElements = this.selected.filter(
                function(selectedElement: Common.Interfaces.IFieldElement, index: number) {
                    return selectedElement.layer.type == layerType;
                });

            if(selectedElements && selectedElements.length > 0) {
                for (let i = 0; i < selectedElements.length; i++) {
                    let selectedElement = selectedElements[i];
                    if(selectedElement)
                        this.toggleSelection(selectedElement);
                }
            }
        }

        /**
         * Sets the selected items to a single selected element; removes and deselects any
         * other currently selected elements.
         * @param {Common.Interfaces.IFieldElement} element [description]
         */
        public setSelection(element: Common.Interfaces.IFieldElement): void {
            // clear any selected players
            this.selected.forEach(
                function(selectedElement: Common.Interfaces.IFieldElement, index: number) {
                    selectedElement.deselect();
                });

            this.selected.removeAll();
            element.select();
            this.selected.add(element);
        }
        
        /**
         * Toggles the selection state of the given element; adds it to the
         * list of selected elements if it isn't already added; if it's already
         * selected, deselects the element and removes it from the selected 
         * @param {Common.Interfaces.IFieldElement} element [description]
         */
        public toggleSelection(element: Common.Interfaces.IFieldElement) {

            // element.graphics.toggleSelect();
            
            if (this.selected.contains(element.guid)) {
                this.selected.remove(element.guid);
                element.deselect();
            }
            else {
                this.selected.add(element);
                element.select();
            }
        }

        /**
         * Returns the absolute y-coordinate of the line of scrimmage
         * @return {number} [description]
         */
        public getLOSAbsolute(): number {
            if (!this.los)
                throw new Error('Field getLOSAbsolute(): los is null or undefined');
            return this.los.graphics.location.ay;
        }
    }
}
