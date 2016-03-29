/// <reference path='../models.ts' />

module Playbook.Models {
    export class PlaybookModelCollection
    extends Common.Models.ModifiableCollection<Playbook.Models.PlaybookModel> {

        constructor() {
            super();
        }
        public toJson(): any {
            return {
                guid: this.guid,
                playbooks: super.toJson()
            };
        }
        public fromJson(json: any): any {
            if (!json)
                return;
            this.guid = json.guid || this.guid;
            var playbooks = json.playbooks || [];
            for (var i = 0; i < playbooks.length; i++) {
                var rawPlaybook = playbooks[i];
                var playbookModel = new Playbook.Models.PlaybookModel();
                playbookModel.fromJson(rawPlaybook);
                this.add(playbookModel);
            }
        }
    }
}