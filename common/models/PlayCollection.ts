/// <reference path='./models.ts' />

module Common.Models {
    
    export class PlayCollection
    extends Common.Models.ActionableCollection<Common.Interfaces.IPlay> {

        public unitType: Team.Enums.UnitTypes;

        constructor(unitType: Team.Enums.UnitTypes) {
            super();
            this.unitType = unitType;
        }

        public toJson(): any {
            let self = this;
            return $.extend(super.toJson(), {
                unitType: self.unitType
            });
        }

        public fromJson(json: any) {
            if (!json)
                return;

            this.unitType = json.unitType;

            let plays = json.plays;
            if (!plays)
                plays = [];

            for (var i = 0; i < plays.length; i++) {
                var obj = plays[i];
                var rawPlay = obj.data.play;
                if (Common.Utilities.isNullOrUndefined(rawPlay))
                    continue;
                
                rawPlay.unitType = Common.Utilities.isNullOrUndefined(rawPlay.unitType) &&
                    rawPlay.unitType >= 0 ? rawPlay.unitType : Team.Enums.UnitTypes.Other;

                rawPlay.key = obj.key;
                // TODO
                var playModel = new Common.Models.PlayPrimary(rawPlay.unitType);
                playModel.fromJson(rawPlay);
                this.add(playModel);
            }
        }
    }
}