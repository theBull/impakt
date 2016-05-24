/// <reference path='./models.ts' />

module Common.Models {
    export abstract class Field
    extends Common.Models.Modifiable {

        public paper: Common.Interfaces.IPaper;
        public grid: Common.Interfaces.IGrid;
        public scenario: Common.Models.Scenario;
        public primaryPlayers: Common.Models.PlayerCollection;
        public opponentPlayers: Common.Models.PlayerCollection;
        public selected: Common.Models.Collection<Common.Interfaces.IFieldElement>;
        public layers: Common.Models.LayerCollection;
        public cursorCoordinates: Common.Models.Coordinates;
        public editorType: Playbook.Enums.EditorTypes;

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
            scenario: Common.Models.Scenario
        ) {
            super();
            super.setContext(this);
            
            this.paper = paper;
            this.grid = this.paper.grid;
            this.scenario = scenario;
            this.primaryPlayers = new Common.Models.PlayerCollection();
            this.opponentPlayers = new Common.Models.PlayerCollection();
            this.selected = new Common.Models.Collection<Common.Interfaces.IFieldElement>();
            this.layers = new Common.Models.LayerCollection();
            this.cursorCoordinates = new Common.Models.Coordinates(0, 0);
            this.editorType = Playbook.Enums.EditorTypes.Any;

            let self = this;
            this.selected.onModified(function() {
                self.setModified(true);
            });

            this.primaryPlayers.onModified(function() {
                self.setModified(true);
            });

            this.opponentPlayers.onModified(function() {
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

        public registerLayer(layer: Common.Models.Layer) {
            this.layers.add(layer);
        }

        public draw(): void {
            this.ground.draw();
            this.grid.draw();
            this.los.draw();
            this.ball.draw();
            this.drawScenario();
        }
        public clearPlayers(): void {
            this.clearPrimaryPlayers();
            this.clearOpponentPlayers();
        }
        public clearPrimaryPlayers(): void {
            this.primaryPlayers.forEach(function(player, index) {
                if (Common.Utilities.isNotNullOrUndefined(player.assignment)) {
                    player.assignment.routes.forEach(function(route: Common.Interfaces.IRoute, index: number) {
                        route.layer.remove();
                    });
                }
                player.layer.remove();
            });
            this.primaryPlayers.removeAll();
        }
        public clearOpponentPlayers(): void {
            this.opponentPlayers.forEach(function(player, index) {
                if (Common.Utilities.isNotNullOrUndefined(player.assignment)) {
                    player.assignment.routes.forEach(function(route: Common.Interfaces.IRoute, index: number) {
                        route.layer.remove();
                    });
                }
                player.layer.remove();
            });
            this.opponentPlayers.removeAll();
        }
        public clearScenario(): void {
            this.clearPrimaryPlay();
            this.clearOpponentPlay();
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
            this.clearScenario();
            this.scenario = scenario;
            this.drawScenario();
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

        public applyPrimaryFormation(formation: Common.Models.Formation): void {
            if (Common.Utilities.isNullOrUndefined(formation) ||
                Common.Utilities.isNullOrUndefined(this.scenario) ||
                Common.Utilities.isNullOrUndefined(this.scenario.playPrimary))
                return;

            //console.log(formation);
            // the order of placements within the formation get applied straight across
            // to the order of personnel and positions.
            let self = this;
            this.primaryPlayers.forEach(function(player, index) {
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
            
            this.scenario.playPrimary.setFormation(formation);
        }

        public applyPrimaryAssignmentGroup(assignmentGroup: Common.Models.AssignmentGroup): void {
            if (Common.Utilities.isNullOrUndefined(assignmentGroup) ||
                Common.Utilities.isNullOrUndefined(this.scenario) ||
                Common.Utilities.isNullOrUndefined(this.scenario.playPrimary))
                return;

            let self = this;
            if (assignmentGroup.assignments.hasElements()) {
                assignmentGroup.assignments.forEach(function(assignment, index) {
                    if (Common.Utilities.isNullOrUndefined(assignment))
                        return;
                    
                    let player = self.getPrimaryPlayerWithPositionIndex(assignment.positionIndex);
                    if (player) {
                        assignment.setContext(player);
                        player.assignment.remove();
                        player.assignment = assignment;
                        player.draw();
                    }
                });

                this.scenario.playPrimary.setAssignmentGroup(assignmentGroup);
            }
        }
        public applyPrimaryPersonnel(personnel: Team.Models.Personnel): void {
            if (Common.Utilities.isNullOrUndefined(personnel) ||
                Common.Utilities.isNullOrUndefined(this.scenario) ||
                Common.Utilities.isNullOrUndefined(this.scenario.playPrimary))
                return;

            let self = this;
            if (personnel && personnel.hasPositions()) {
                this.primaryPlayers.forEach(function(player, index) {
                    let newPosition = personnel.positions.getIndex(index);
                    if (self.scenario.playPrimary.personnel &&
                        self.scenario.playPrimary.personnel.hasPositions()) {
                        self.scenario.playPrimary.personnel.positions.getIndex(index).fromJson(newPosition.toJson());
                    }
                    player.position.fromJson(newPosition.toJson());
                    player.draw();
                });
                
                this.scenario.playPrimary.setPersonnel(personnel);
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
            if (Common.Utilities.isNullOrUndefined(unitType) ||
                Common.Utilities.isNullOrUndefined(this.scenario) ||
                Common.Utilities.isNullOrUndefined(this.scenario.playPrimary))
                return;
            

            this.scenario.playPrimary.setUnitType(unitType);
            
            if(Common.Utilities.isNotNullOrUndefined(this.scenario.playOpponent))
                this.scenario.playOpponent.setUnitType(this.scenario.playPrimary.getOpposingUnitType());
            
            this.clearPlayers();
            this.drawScenario();
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
