/// <reference path='./models.ts' />

module Common.Models {
    export class PlayCollection
        extends Common.Models.ModifiableCollection<Common.Models.Play> {

        constructor() {
            super();
        }

        public toJson(): any {
            return super.toJson();
        }

        public fromJson(plays: any[]) {
            if (!plays)
                plays = [];

            for (var i = 0; i < plays.length; i++) {
                var obj = plays[i];
                var rawPlay = obj.data.play;
                rawPlay.key = obj.key;
                // TODO
                var playModel = new Common.Models.Play();
                playModel.fromJson(rawPlay);
                this.add(playModel);
            }
        }
    }
}