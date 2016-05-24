/// <reference path='./models.ts' />

module Common.Models {

	export class Scenario
	extends Common.Models.AssociableEntity {

		public unitType: Team.Enums.UnitTypes;
		public playPrimary: Common.Models.PlayPrimary;
		public playOpponent: Common.Models.PlayOpponent;
        public editorType: Playbook.Enums.EditorTypes;
		public name: string;
		public png: string;
		public key: number;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.Scenario);
			this.playPrimary = new Common.Models.PlayPrimary(Team.Enums.UnitTypes.Other);
			this.playOpponent = new Common.Models.PlayOpponent(Team.Enums.UnitTypes.Other);
			this.unitType = this.playPrimary.unitType;
			this.editorType = Playbook.Enums.EditorTypes.Play;
		}

		public copy(newScenario?: Common.Models.Scenario): Common.Models.Scenario {
			var copyScenario = newScenario || new Common.Models.Scenario();
			
			if(Common.Utilities.isNotNullOrUndefined(this.playPrimary))
				copyScenario.playPrimary = this.playPrimary.copy();
			
			if(Common.Utilities.isNotNullOrUndefined(this.playOpponent))
				copyScenario.playOpponent = this.playOpponent.copy();
            
            return <Common.Models.Scenario>super.copy(copyScenario, this);
		}

		public toJson(): void {
			return $.extend({
				name: this.name,
				png: this.png,
				unitType: this.unitType,
				editorType: this.editorType
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.name = json.name;
			this.unitType = json.unitType;
			this.png = json.png;
			this.editorType = json.editorType;

			super.fromJson(json);
		}

		public setPlayPrimary(play: Common.Interfaces.IPlay): void {
			if (Common.Utilities.isNullOrUndefined(play)) {
				this.playPrimary = null;
				return;
			}

			// ensure the play passed in is of type primary
			this.playPrimary = Common.Models.Play.toPrimary(play);
			this.unitType = this.playPrimary.unitType;
			this.setModified(true);
		}

		public setPlayOpponent(play: Common.Interfaces.IPlay): void {
			if (Common.Utilities.isNullOrUndefined(play)) {
				this.playOpponent = null;
				return;
			}

			// ensure the play passed in is of type Opponent
			this.playOpponent = Common.Models.Play.toOpponent(play);
			this.setModified(true);
		}

		public clear(): void {
			this.playPrimary = null;
			this.playOpponent = null;
		}

		public draw(field: Common.Interfaces.IField): void {
			if(Common.Utilities.isNotNullOrUndefined(this.playPrimary))
				this.playPrimary.draw(field);
            
            if (Common.Utilities.isNotNullOrUndefined(this.playOpponent))
                this.playOpponent.draw(field);
		}

	}

}