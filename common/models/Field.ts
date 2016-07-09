/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Field
    extends Common.Models.Actionable {

        public canvas: Common.Interfaces.ICanvas;
        public grid: Common.Interfaces.IGrid;
        public scenario: Common.Models.Scenario;
        public primaryPlayers: Common.Models.PlayerCollection;
        public opponentPlayers: Common.Models.PlayerCollection;
        public selectedElements: Common.Models.Collection<Common.Interfaces.IFieldElement>;
        public layer: Common.Models.Layer;
        public state: Common.Enums.State;
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
            canvas: Common.Interfaces.ICanvas
        ) {
            super(Common.Enums.ImpaktDataTypes.Unknown);
            super.setContext(this);
            
            this.canvas = canvas;
            this.grid = this.canvas.grid;
            this.scenario = null;
            this.primaryPlayers = new Common.Models.PlayerCollection();
            this.opponentPlayers = new Common.Models.PlayerCollection();
            this.selectedElements = new Common.Models.Collection<Common.Interfaces.IFieldElement>();
            this.layer = new Common.Models.Layer(this, Common.Enums.LayerTypes.Field);
            this.cursorCoordinates = new Common.Models.Coordinates(0, 0);

            let self = this;
            this.selectedElements.onModified(function() {
                self.setModified(true);
            });

            this.primaryPlayers.onModified(function() {
                self.setModified(true);
            });

            this.opponentPlayers.onModified(function() {
                self.setModified(true);
            });
        }

        public abstract initialize(): void;

        /**
         * 
         * ABSTRACT METHODS
         * 
         */

        public abstract addPrimaryPlayer(
            placement: Common.Models.Placement,
            position: Team.Models.Position,
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer;

        public abstract addOpponentPlayer(
            placement: Common.Models.Placement,
            position: Team.Models.Position,
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer;

        public abstract useAssignmentTool(coords: Common.Models.Coordinates);

        public draw(): void {
            this.ground.draw();
            this.grid.draw();
            this.los.draw();
            this.ball.draw();
        }
        public clearPlayers(): void {
            this.clearPrimaryPlayers();
            this.clearOpponentPlayers();
        }
        public clearPrimaryPlayers(): void {
            this.primaryPlayers.listen(false);
            let self = this;
            this.layer.removeLayerByType(Common.Enums.LayerTypes.PrimaryPlayer);
            this.primaryPlayers.removeAll();
            this.primaryPlayers.listen(true);
        }
        public clearOpponentPlayers(): void {
            this.opponentPlayers.listen(false);
            this.layer.removeLayerByType(Common.Enums.LayerTypes.OpponentPlayer);
            this.opponentPlayers.removeAll();
            this.opponentPlayers.listen(true);
        }
        public clearScenario(): void {
            this.clearPrimaryPlay();
            this.clearOpponentPlay();
            this.invokeListener('onclear');
        }
        public clearPrimaryPlay(): void {
            this.clearPrimaryPlayers();
        }
        public clearOpponentPlay(): void {
            this.clearOpponentPlayers();
        }
        public drawScenario(): void {
            
            // draw the play data onto the field
            this.scenario.draw(this);
        }
        public updateScenario(scenario: Common.Models.Scenario): void {
            this.state = Common.Enums.State.Updating;
            this.clearScenario();
            this.scenario = scenario;
            this.drawScenario();
            this.state = Common.Enums.State.Ready;
            this.invokeListener('onload');
            this.setModified(true);
        }

        public updatePlacements(): void {
            let self = this;
            if(Common.Utilities.isNotNullOrUndefined(this.scenario)) {
                if (Common.Utilities.isNotNullOrUndefined(this.scenario.playPrimary)) {
                    let primaryPlacementCollection = new Common.Models.PlacementCollection();
                    this.primaryPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                        primaryPlacementCollection.add(player.graphics.placement);
                    });
                    self.scenario.playPrimary.formation.setPlacements(primaryPlacementCollection);
                }

                if (Common.Utilities.isNotNullOrUndefined(this.scenario.playOpponent)) {
                    let opponentPlacementCollection = new Common.Models.PlacementCollection();
                    this.opponentPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                        opponentPlacementCollection.add(player.graphics.placement);
                    });
                    self.scenario.playOpponent.formation.setPlacements(opponentPlacementCollection);
                }
            }
        }

        public setCursorCoordinates(offsetX: number, offsetY: number): void {
            this.cursorCoordinates = this.grid.getCursorPositionCoordinates(offsetX, offsetY);
            this.setModified(true);
        }
        
        public getPrimaryPlayerWithPositionIndex(index: number): Common.Interfaces.IPlayer {
            let matchingPlayer = this.primaryPlayers.filterFirst(function(player) {
                return player.hasPosition() && (player.position.index == index);
            });
            return matchingPlayer;
        }
        
        public getOpponentPlayerWithPositionIndex(index: number): Common.Interfaces.IPlayer {
            let matchingPlayer = this.opponentPlayers.filterFirst(function(player) {
                return player.hasPosition() && (player.position.index == index);
            });
            return matchingPlayer;
        }

        public applyPrimaryPlay(play: any): void {
            throw new Error('field applyPrimaryPlay() not implemented');
        }

        public applyFormation(formation: Common.Models.Formation, playType: Playbook.Enums.PlayTypes): void {
            if (Common.Utilities.isNullOrUndefined(formation) ||
                Common.Utilities.isNullOrUndefined(this.scenario))
                return;

            let formationCopy = formation.copy();
            let playerCollection = null;
            let play = null;
            switch (playType) {
                case Playbook.Enums.PlayTypes.Primary:
                    playerCollection = this.primaryPlayers;
                    play = this.scenario.playPrimary;
                    break;
                case Playbook.Enums.PlayTypes.Opponent:
                    playerCollection = this.opponentPlayers;
                    play = this.scenario.playOpponent;
                    break;
            }

            if (!playerCollection || !play)
                return;
            
            // the order of placements within the formation get applied straight across
            // to the order of personnel and positions.
            let self = this;
            playerCollection.forEach(function(player, index) {
                // NOTE: we're not using the index from the forEach callback,
                // because we can't assume the players collection stores the players
                // in the order according to the player's actual index property
                let playerIndex = player.position.index;
                if (playerIndex < 0) {
                    throw new Error('Player must have a position index');
                }
                let newPlacement = formationCopy.placements.getIndex(playerIndex);
                if (!newPlacement) {
                    throw new Error('Updated player placement is invalid');
                }

                player.setPlacement(newPlacement);
                player.draw();
            });

            // Flip placement for opponent formations
            if (playType == Playbook.Enums.PlayTypes.Opponent)
                formationCopy.placements.flip();
            
            play.setFormation(formationCopy);
        }

        public applyAssignmentGroup(assignmentGroup: Common.Models.AssignmentGroup, playType: Playbook.Enums.PlayTypes): void {
            if (Common.Utilities.isNullOrUndefined(assignmentGroup) ||
                Common.Utilities.isNullOrUndefined(this.scenario))
                return;

            let play = null;
            switch (playType) {
                case Playbook.Enums.PlayTypes.Primary:
                    play = this.scenario.playPrimary;
                    break;
                case Playbook.Enums.PlayTypes.Opponent:
                    play = this.scenario.playOpponent;
                    break;
            }

            if (!play)
                return;

            let self = this;
            if (assignmentGroup.assignments.hasElements()) {
                assignmentGroup.assignments.forEach(function(assignment, index) {
                    if (Common.Utilities.isNullOrUndefined(assignment))
                        return;
                    
                    let player = null;
                    switch (playType) {
                        case Playbook.Enums.PlayTypes.Primary:
                            player = self.getPrimaryPlayerWithPositionIndex(assignment.positionIndex);
                            break;
                        case Playbook.Enums.PlayTypes.Opponent:
                            player = self.getOpponentPlayerWithPositionIndex(assignment.positionIndex);
                            break;
                    }
                    if (player) {
                        player.setAssignment(assignment);
                        player.draw();
                    }
                });

                play.setAssignmentGroup(assignmentGroup);
            }
        }

        public applyPersonnel(personnel: Team.Models.Personnel, playType: Playbook.Enums.PlayTypes): void {
            if (Common.Utilities.isNullOrUndefined(personnel) ||
                Common.Utilities.isNullOrUndefined(this.scenario))
                return;

            let playerCollection = null;
            let play = null;
            switch (playType) {
                case Playbook.Enums.PlayTypes.Primary:
                    playerCollection = this.primaryPlayers;
                    play = this.scenario.playPrimary;
                    break;
                case Playbook.Enums.PlayTypes.Opponent:
                    playerCollection = this.opponentPlayers;
                    play = this.scenario.playOpponent;
                    break;
            }

            if (!playerCollection || !play)
                return;

            let self = this;
            if (personnel && personnel.hasPositions()) {
                playerCollection.forEach(function(player, index) {
                    let newPosition = personnel.positions.getIndex(index);
                    if (play.personnel &&
                        play.personnel.hasPositions()) {
                        play.personnel.positions.getIndex(index).fromJson(newPosition.toJson());
                    }
                    player.position.fromJson(newPosition.toJson());
                    player.draw();
                });
                
                play.setPersonnel(personnel);
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
        
        public deselectAll(): void {
            if (this.selectedElements.isEmpty())
                return;
            
            this.selectedElements.forEach(function(element: Common.Interfaces.IFieldElement, index: number) {
                element.deselect();
            });
            this.selectedElements.removeAll();
        }

        public getSelectedByLayerType(layerType: Common.Enums.LayerTypes)
        : Common.Models.Collection<Common.Interfaces.IFieldElement> {
            let collection = new Common.Models.Collection<Common.Interfaces.IFieldElement>();
            this.selectedElements.forEach(function(selectedElement: Common.Interfaces.IFieldElement, index: number) {
                if(selectedElement.layer.type == layerType) {
                    collection.add(selectedElement);
                }
            });
            return collection;
        }

        public toggleSelectionByLayerType(layerType: Common.Enums.LayerTypes): void {
            let selectedElements = this.selectedElements.filter(
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
            this.selectedElements.forEach(
                function(selectedElement: Common.Interfaces.IFieldElement, index: number) {
                    selectedElement.deselect();
                });

            this.selectedElements.removeAll();
            element.select();
            this.selectedElements.add(element);
        }
        
        /**
         * Toggles the selection state of the given element; adds it to the
         * list of selected elements if it isn't already added; if it's already
         * selected, deselects the element and removes it from the selected 
         * @param {Common.Interfaces.IFieldElement} element [description]
         */
        public toggleSelection(element: Common.Interfaces.IFieldElement) {

            // element.graphics.toggleSelect();
            
            if (this.selectedElements.contains(element.guid)) {
                this.selectedElements.remove(element.guid);
                element.deselect();
            }
            else {
                this.selectedElements.add(element);
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
