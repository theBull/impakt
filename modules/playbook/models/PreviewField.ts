/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class PreviewField
    extends Common.Models.Field
    implements Common.Interfaces.IField {

        constructor(
            paper: Common.Interfaces.IPaper,
            playPrimary: Common.Models.PlayPrimary,
            playOpponent: Common.Models.PlayOpponent
        ) {
            super(paper, playPrimary, playOpponent);
        }

        public initialize(): void {
            this.ball = new Playbook.Models.PreviewBall(this);
            this.ground = new Playbook.Models.PreviewGround(this);
            this.los = new Playbook.Models.PreviewLineOfScrimmage(this);
            this.endzone_top = new Playbook.Models.PreviewEndzone(this, 0);
            this.endzone_bottom = new Playbook.Models.PreviewEndzone(this, 110);
            this.sideline_left = new Playbook.Models.PreviewSideline(this, 0);
            this.sideline_right = new Playbook.Models.PreviewSideline(this, 51);
            this.hashmark_left = new Playbook.Models.PreviewHashmark(this, 22);
            this.hashmark_right = new Playbook.Models.PreviewHashmark(this, 28);
            this.hashmark_sideline_left = new Playbook.Models.PreviewHashmark(this, 2);
            this.hashmark_sideline_right = new Playbook.Models.PreviewHashmark(this, 50);

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

        public draw(): void {
            this.ground.draw();
            this.hashmark_left.draw();
            this.hashmark_right.draw();
            this.sideline_left.draw();
            this.sideline_right.draw();
            this.los.draw();
            this.ball.draw();
            // draw the play data onto the field
            if (this.playPrimary)
                this.playPrimary.draw(this);
            // draw the opponent play data onto the field
            if (this.playOpponent)
                this.playOpponent.draw(this);
        }
        public addPlayer(
            placement: Common.Models.Placement,
            position: Team.Models.Position,
            assignment: Common.Models.Assignment
        ): Common.Interfaces.IPlayer {
            // TODO @theBull - look into this
            // adjust for no sidelines...
            //placement.x -= 1;
            let player = new Playbook.Models.PreviewPlayer(
                this, 
                placement, 
                position, 
                assignment
            );

            // TODO @theBull - add players to new layers
            player.draw();
            this.players.add(player);
            return player;
        }

        public useAssignmentTool(coords: Common.Models.Coordinates): void {
            // do nothing
        }
    }
}
