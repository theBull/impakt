/// <reference path='../models.ts' />

module Playbook.Models {

	export class PlayCollection
		extends Common.Models.ModifiableCollection<Playbook.Models.Play> {

		constructor() {
			super();
		}

		

		public addAllRaw(plays: any[]) {
			if (!plays)
				plays = [];

			for (let i = 0; i < plays.length; i++) {
				let obj = plays[i];
				let rawPlay = obj.data.play;
				rawPlay.key = obj.key;

				// TODO
				let playModel = new Playbook.Models.Play();
				playModel.fromJson(rawPlay);

				this.add(playModel);

			}
		}
	}
}