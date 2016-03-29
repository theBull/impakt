/// <reference path='../models.ts' />


module Playbook.Models {
    export class PositionCollection
        extends Common.Models.ModifiableCollection<Playbook.Models.Position> {

        constructor() {
            super();
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
                var positionModel = new Playbook.Models.Position();
                positionModel.fromJson(rawPosition);
                this.add(positionModel);
            }
        }
        public setDefault() {
        }
    }
}