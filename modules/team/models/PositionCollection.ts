/// <reference path='./models.ts' />


module Team.Models {
    export class PositionCollection
    extends Common.Models.Collection<Team.Models.Position> {

        public unitType: Team.Enums.UnitTypes;

        constructor(unitType: Team.Enums.UnitTypes) {
            super();
            this.unitType = unitType;
            this.setDefault();
        }
        public listPositions() {
            var arr = [];
            this.forEach(function(position, index) {
                arr.push(position.title);
            });
            return arr;
        }
        public toJson(): any {
            return super.toJson();
        }
        public fromJson(positions: any): any {
            if (!positions)
                return;

            for (var i = 0; i < positions.length; i++) {
                var rawPosition = positions[i];
                if (Common.Utilities.isNullOrUndefined(rawPosition))
                    continue;

                rawPosition.unitType = !Common.Utilities.isNullOrUndefined(rawPosition.unitType) &&
                    rawPosition.unitType >= 0 ? rawPosition.unitType : Team.Enums.UnitTypes.Other;

                var positionModel = new Team.Models.Position(rawPosition.unitType);
                positionModel.fromJson(rawPosition);
                this.add(positionModel);
            }
        }
        public setDefault() {
        }
    }
}