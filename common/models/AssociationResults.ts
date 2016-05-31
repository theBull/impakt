/// <reference path='./models.ts' />

module Common.Models {

	export class AssociationResults {

		public playbooks: Common.Models.PlaybookModelCollection;
		public scenarios: Common.Models.ScenarioCollection;
		public plays: Common.Models.PlayCollection;
		public formations: Common.Models.FormationCollection;
		public personnel: Team.Models.PersonnelCollection;
		public assignmentGroups: Common.Models.AssignmentGroupCollection;
		public leagues: League.Models.LeagueModelCollection;
		public conferences: League.Models.ConferenceCollection;
		public divisions: League.Models.DivisionCollection;
		public locations: League.Models.LocationCollection;
		public teams: Team.Models.TeamModelCollection;
		public seasons: Season.Models.SeasonModelCollection;
		public games: Season.Models.GameCollection;

		constructor() {
			this.playbooks = new Common.Models.PlaybookModelCollection(Team.Enums.UnitTypes.Mixed);
			this.scenarios = new Common.Models.ScenarioCollection(Team.Enums.UnitTypes.Mixed);
			this.plays = new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed);
			this.formations = new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed);
			this.personnel = new Team.Models.PersonnelCollection(Team.Enums.UnitTypes.Mixed);
			this.assignmentGroups = new Common.Models.AssignmentGroupCollection(Team.Enums.UnitTypes.Mixed);
			this.leagues = new League.Models.LeagueModelCollection();
			this.conferences = new League.Models.ConferenceCollection();
			this.divisions = new League.Models.DivisionCollection();
			this.locations = new League.Models.LocationCollection();
			this.teams = new Team.Models.TeamModelCollection();
			this.seasons = new Season.Models.SeasonModelCollection();
			this.games = new Season.Models.GameCollection();
		}

		public count(): number {
			let count = 0;
			count += this.playbooks.size();
			count += this.scenarios.size();
			count += this.plays.size();
			count += this.formations.size();
			count += this.personnel.size();
			count += this.assignmentGroups.size();
			count += this.leagues.size();
			count += this.conferences.size();
			count += this.divisions.size();
			count += this.locations.size();
			count += this.teams.size();
			count += this.seasons.size();
			count += this.games.size();

			return count;
		}

		public hasAssociations(): boolean {
			return this.count() > 0;
		}

		public isEmpty(): boolean {
			return this.count() == 0;
		}

		public getPopulatedAssociationKeys(): string[] {
			let populated = [];

			if (this.playbooks.hasElements())
				populated.push('playbooks');
			
			if (this.scenarios.hasElements())
				populated.push('scenarios');
			
			if (this.plays.hasElements())
				populated.push('plays');
			
			if (this.formations.hasElements())
				populated.push('formations');
			
			if (this.personnel.hasElements())
				populated.push('personnel');
			
			if (this.assignmentGroups.hasElements())
				populated.push('assignmentGroups');
			
			if (this.leagues.hasElements())
				populated.push('leagues');
			
			if (this.conferences.hasElements())
				populated.push('conferences');
			
			if (this.divisions.hasElements())
				populated.push('divisions');
			
			if (this.locations.hasElements())
				populated.push('locations');
			
			if (this.teams.hasElements())
				populated.push('teams');
			
			if (this.seasons.hasElements())
				populated.push('seasons');
			
			if (this.games.hasElements())
				populated.push('games');

			return populated;
		}
		
	}
}