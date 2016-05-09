/// <reference path='./models.ts' />

module Common.Models {
    export class PlaybookModel
        extends Common.Models.AssociableEntity {
    
        public name: string;
        public unitType: Team.Enums.UnitTypes;
        
        constructor(unitType: Team.Enums.UnitTypes) {
            super(Common.Enums.ImpaktDataTypes.Playbook);
            super.setContext(this);

            this.name = 'Untitled';
            this.unitType = unitType;
        }
        public toJson(): any {
            return $.extend({
                name: this.name,
                unitType: this.unitType
            }, super.toJson());
        }
        public fromJson(json: any): any {
            if (!json)
                return;

            this.name = json.name;
            this.unitType = json.unitType;

            super.fromJson(json);
        }
    }
}