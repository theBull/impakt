/// <reference path='./details.mdl.ts' />

impakt.details.service('_details', [
'$q',
'_league',
'_playbook',
'_team',
function(
	$q: any,
	_league: any,
	_playbook: any,
	_team
) {
	
	this.selectedElements = impakt.context.Actionable.selected;
	this.state = {
		collapsed: true
	};

	let self = this;
	this.selectedElements.onModified(function(collection: any) {
		if(collection.hasElements())
			self.state.collapsed = false;
	});

	this.toggleSelection = function(element: Common.Interfaces.IActionable) {
		this.selectedElements.deselectAll();

		if (!this.selectedElements.contains(element.guid)) {
			element.select();
			this.selectedElements.only(element);
		} else {
			this.selectedElements.empty();
		}
	}

	this.updatePlay = function(play: Common.Models.Play) {
		_playbook.updatePlay(play);
	}

	this.delete = function(entity: Common.Interfaces.IActionable) {
		switch (entity.impaktDataType) {
			case Common.Enums.ImpaktDataTypes.Play:
			case Common.Enums.ImpaktDataTypes.Formation:
			case Common.Enums.ImpaktDataTypes.AssignmentGroup:
			case Common.Enums.ImpaktDataTypes.Scenario:
			case Common.Enums.ImpaktDataTypes.Playbook:
				return _playbook.deleteEntityByType(entity);

			case Common.Enums.ImpaktDataTypes.Conference:
			case Common.Enums.ImpaktDataTypes.League:
				return _league.deleteEntityByType(entity);

			case Common.Enums.ImpaktDataTypes.Team:
			case Common.Enums.ImpaktDataTypes.PersonnelGroup:
				return _team.deleteEntityByType(entity);
		}
	}

}]);