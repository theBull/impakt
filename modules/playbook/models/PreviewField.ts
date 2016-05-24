/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class PreviewField
    extends Common.Models.Field
    implements Common.Interfaces.IField {

        constructor(
            paper: Common.Interfaces.IPaper,
            scenario: Common.Models.Scenario
        ) {
            super(paper, scenario);
        }

        public initialize(): void {
            this.ball = new Playbook.Models.PreviewBall();
            this.ball.initialize(this, null);
            
            this.ground = new Playbook.Models.PreviewGround();
            this.ground.initialize(this, null);

            this.los = new Playbook.Models.PreviewLineOfScrimmage();
            this.los.initialize(this, null);

            this.endzone_top = new Playbook.Models.PreviewEndzone(0);
            this.endzone_top.initialize(this, null);

            this.endzone_bottom = new Playbook.Models.PreviewEndzone(110);
            this.endzone_bottom.initialize(this, null);

            this.sideline_left = new Playbook.Models.PreviewSideline(0);
            this.sideline_left.initialize(this, null);

            this.sideline_right = new Playbook.Models.PreviewSideline(51);
            this.sideline_right.initialize(this, null);

            this.hashmark_left = new Playbook.Models.PreviewHashmark(22);
            this.hashmark_left.initialize(this, null);

            this.hashmark_right = new Playbook.Models.PreviewHashmark(28);
            this.hashmark_right.initialize(this, null);

            this.hashmark_sideline_left = new Playbook.Models.PreviewHashmark(2);
            this.hashmark_sideline_left.initialize(this, null);

            this.hashmark_sideline_right = new Playbook.Models.PreviewHashmark(50);
            this.hashmark_sideline_right.initialize(this, null);

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

            if(Common.Utilities.isNotNullOrUndefined(this.scenario)) {
                if (Common.Utilities.isNotNullOrUndefined(this.scenario.playPrimary) && Common.Utilities.isNullOrUndefined(this.scenario.playPrimary.formation)) {
                    this.scenario.playPrimary.formation = new Common.Models.Formation(this.scenario.playPrimary.unitType);
                    this.scenario.playPrimary.formation.setDefault(this.ball);
                }

                if (Common.Utilities.isNotNullOrUndefined(this.scenario.playOpponent) && Common.Utilities.isNullOrUndefined(this.scenario.playOpponent.formation)) {
                    this.scenario.playOpponent.formation = new Common.Models.Formation(this.scenario.playOpponent.unitType);
                    this.scenario.playOpponent.formation.setDefault(this.ball);
                }
            }

            this.draw();
        }

        public draw(): void {
            this.ground.draw();
            this.hashmark_left.draw();
            this.hashmark_right.draw();
            this.sideline_left.draw();
            this.sideline_right.draw();
            this.endzone_top.draw();
            this.endzone_bottom.draw();
            this.los.draw();
            this.ball.draw();
            this.drawScenario();
        }
        public addPrimaryPlayer(
            placement: Common.Models.Placement,
            position: Team.Models.Position,
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer {
            // TODO @theBull - look into this
            // adjust for no sidelines...
            //placement.x -= 1;
            let player = new Playbook.Models.PreviewPlayer(
                placement, 
                position, 
                assignment
            );

            player.initialize(this);

            // TODO @theBull - add players to new layers
            player.draw();
            
            this.primaryPlayers.add(player);
            return player;
        }
        public addOpponentPlayer(
            placement: Common.Models.Placement,
            position: Team.Models.Position,
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer {
            // TODO @theBull - look into this
            // adjust for no sidelines...
            //placement.x -= 1;
            let player = new Playbook.Models.PreviewPlayer(
                placement, 
                position, 
                assignment
            );

            player.initialize(this);

            // TODO @theBull - add players to new layers
            player.draw();
            
            this.opponentPlayers.add(player);
            return player;
        }

        public useAssignmentTool(coords: Common.Models.Coordinates): void {
            // do nothing
        }
    }
}
