/// <reference path='./models.ts' />

module Common.Models {

	export class Scenario
	extends Common.Models.AssociableEntity {

		public unitType: Team.Enums.UnitTypes;
		public playPrimary: Common.Models.PlayPrimary;
		public playOpponent: Common.Models.PlayOpponent;
		public playPrimaryGuid: string;
		public playOpponentGuid: string;
        public editorType: Playbook.Enums.EditorTypes;
		public png: string;
		public key: number;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.Scenario);
			this.playPrimary = new Common.Models.PlayPrimary(Team.Enums.UnitTypes.Other);
			this.playPrimaryGuid = this.playPrimary.guid;
			this.playOpponent = new Common.Models.PlayOpponent(Team.Enums.UnitTypes.Other);
			this.playOpponentGuid = this.playOpponent.guid;
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
				editorType: this.editorType,
				playPrimaryGuid: this.playPrimaryGuid,
				playOpponentGuid: this.playOpponentGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.name = json.name;
			this.unitType = json.unitType;
			this.png = json.png;
			this.editorType = json.editorType;
			this.playPrimaryGuid = json.playPrimaryGuid;
			this.playOpponentGuid = json.playOpponentGuid;

			super.fromJson(json);
		}

		public setPlayPrimary(play: Common.Interfaces.IPlay): void {
			if (Common.Utilities.isNullOrUndefined(play)) {
				this.playPrimary = null;
				return;
			}

			// ensure the play passed in is of type primary
			this.playPrimary = Common.Models.Play.toPrimary(play);
			this.playPrimaryGuid = this.playPrimary.guid;
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
			this.playOpponentGuid = this.playOpponent.guid;
			this.setModified(true);
		}

		public clear(): void {
			this.playPrimary = null;
			this.playPrimaryGuid = null;
			this.playOpponent = null;
			this.playOpponentGuid = null;
		}

		public draw(field: Common.Interfaces.IField): void {
			if(Common.Utilities.isNotNullOrUndefined(this.playPrimary))
				this.playPrimary.draw(field);
            
            if (Common.Utilities.isNotNullOrUndefined(this.playOpponent))
                this.playOpponent.draw(field);
		}

	}

}