/// <reference path='./models.ts' />

module Common.Models {
    
    export class ScenarioCollection
    extends Common.Models.ActionableCollection<Common.Interfaces.IScenario> {

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

            if (!json.scenarios)
                json.scenarios = [];

            for (var i = 0; i < json.scenarios.length; i++) {
                var obj = json.scenarios[i];
                var rawScenario = obj.data.scenario;
                if (Common.Utilities.isNullOrUndefined(rawScenario))
                    continue;
                
                rawScenario.unitType = Common.Utilities.isNullOrUndefined(rawScenario.unitType) &&
                    rawScenario.unitType >= 0 ? rawScenario.unitType : Team.Enums.UnitTypes.Other;

                rawScenario.key = obj.key;
                // TODO
                var scenarioModel = new Common.Models.Scenario();
                scenarioModel.fromJson(rawScenario);
                this.add(scenarioModel);
            }
        }
    }
}