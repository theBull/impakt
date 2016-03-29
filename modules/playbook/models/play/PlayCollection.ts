/// <reference path='../models.ts' />

module Playbook.Models {
    export class PlayCollection
        extends Common.Models.ModifiableCollection<Playbook.Models.Play> {

        constructor() {
            super();
        }

        public toJson(): any {
            throw new Error('PlayCollection toJson(): not implemented');
        }

        public fromJson(plays: any[]) {
            if (!plays)
                plays = [];

            for (var i = 0; i < plays.length; i++) {
                var obj = plays[i];
                var rawPlay = obj.data.play;
                rawPlay.key = obj.key;
                // TODO
                var playModel = new Playbook.Models.Play();
                playModel.fromJson(rawPlay);
                this.add(playModel);
            }
        }
    }
}