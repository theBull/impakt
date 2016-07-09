/// <reference path='./models.ts' />

module Playbook.Models {
    
    export class PreviewField
    extends Common.Models.Field
    implements Common.Interfaces.IField {

        constructor(
            canvas: Common.Interfaces.ICanvas
        ) {
            super(canvas);

            this.initialize();
            this.state = Common.Enums.State.Constructed;
        }

        public initialize(): void {
            if(!this.ball) {
                this.ball = new Playbook.Models.PreviewBall();
                this.ball.initialize(this, null);
                this.layer.addLayer(this.ball.layer);
            }
            
            if(!this.ground) {
                this.ground = new Playbook.Models.PreviewGround();
                this.ground.initialize(this, null);
                this.layer.addLayer(this.ground.layer);
            }

            if(!this.los) {
                this.los = new Playbook.Models.PreviewLineOfScrimmage();
                this.los.initialize(this, null);
                this.layer.addLayer(this.los.layer);
            }

            if(!this.endzone_top) {
                this.endzone_top = new Playbook.Models.PreviewEndzone(0);
                this.endzone_top.initialize(this, null);
                this.layer.addLayer(this.endzone_top.layer);
            }

            if(!this.endzone_bottom) {
                this.endzone_bottom = new Playbook.Models.PreviewEndzone(110);
                this.endzone_bottom.initialize(this, null);
                this.layer.addLayer(this.endzone_bottom.layer);
            }

            if(!this.sideline_left) {
                this.sideline_left = new Playbook.Models.PreviewSideline(0);
                this.sideline_left.initialize(this, null);
                this.layer.addLayer(this.sideline_left.layer);
            }

            if(!this.sideline_right) {
                this.sideline_right = new Playbook.Models.PreviewSideline(51);
                this.sideline_right.initialize(this, null);
                this.layer.addLayer(this.sideline_right.layer);
            }

            if(!this.hashmark_left) {
                this.hashmark_left = new Playbook.Models.PreviewHashmark(22);
                this.hashmark_left.initialize(this, null);
                this.layer.addLayer(this.hashmark_left.layer);
            }

            if(!this.hashmark_right) {
                this.hashmark_right = new Playbook.Models.PreviewHashmark(28);
                this.hashmark_right.initialize(this, null);
                this.layer.addLayer(this.hashmark_right.layer);
            }

            if(!this.hashmark_sideline_left) {
                this.hashmark_sideline_left = new Playbook.Models.PreviewHashmark(2);
                this.hashmark_sideline_left.initialize(this, null);
                this.layer.addLayer(this.hashmark_sideline_left.layer);
            }

            if(!this.hashmark_sideline_right) {
                this.hashmark_sideline_right = new Playbook.Models.PreviewHashmark(50);
                this.hashmark_sideline_right.initialize(this, null);
                this.layer.addLayer(this.hashmark_sideline_right.layer);
            }

            this.draw();

            this.invokeListener('onready');
            this.state = Common.Enums.State.Ready;
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
            player.draw();
            player.layer.type = Common.Enums.LayerTypes.PrimaryPlayer;
            
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
            player.draw();
            player.layer.type = Common.Enums.LayerTypes.OpponentPlayer;
            
            this.opponentPlayers.add(player);
            return player;
        }

        public useAssignmentTool(coords: Common.Models.Coordinates): void {
            // do nothing
        }
    }
}
