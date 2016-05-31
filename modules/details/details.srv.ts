/// <reference path='./details.mdl.ts' />

impakt.details.service('_details', [
'$q',
'_league',
'_playbook',
'_team',
'_season',
function(
	$q: any,
	_league: any,
	_playbook: any,
	_team: any,
	_season: any
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

	/**
	 * NOTE: if the given entity's impaktDataType is not supported,
	 * an exception will be thrown; this is because the function MUST
	 * return a promise object (which is defined within the `deleteEntityByType` methods
	 * below in their respecitve services). If no applicable case is met,
	 * we have nothing left but to stop traffic and complain.
	 * 
	 * @param {Common.Interfaces.IActionable} entity [description]
	 */
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
			case Common.Enums.ImpaktDataTypes.Division:
			case Common.Enums.ImpaktDataTypes.Location:
				return _league.deleteEntityByType(entity);

			case Common.Enums.ImpaktDataTypes.Team:
			case Common.Enums.ImpaktDataTypes.PersonnelGroup:
				return _team.deleteEntityByType(entity);

			case Common.Enums.ImpaktDataTypes.Season:
			case Common.Enums.ImpaktDataTypes.Game:
				return _season.deleteEntityByType(entity);

			default:
				throw new Error('_details delete(): entity ImpaktDataType not supported ' + entity.impaktDataType);
		}
	}

	/**
	 * NOTE: if the given entity's impaktDataType is not supported,
	 * an exception will be thrown; this is because the function MUST
	 * return a promise object (which is defined within the `updateEntityByType` methods
	 * below in their respecitve services). If no applicable case is met,
	 * we have nothing left but to stop traffic and complain.
	 * 
	 * @param {Common.Interfaces.IActionable} entity [description]
	 */
	this.update = function(entity: Common.Interfaces.IActionable) {
		switch (entity.impaktDataType) {
			case Common.Enums.ImpaktDataTypes.Play:
			case Common.Enums.ImpaktDataTypes.Formation:
			case Common.Enums.ImpaktDataTypes.AssignmentGroup:
			case Common.Enums.ImpaktDataTypes.Scenario:
			case Common.Enums.ImpaktDataTypes.Playbook:
				return _playbook.updateEntityByType(entity);

			case Common.Enums.ImpaktDataTypes.Conference:
			case Common.Enums.ImpaktDataTypes.League:
			case Common.Enums.ImpaktDataTypes.Division:
			case Common.Enums.ImpaktDataTypes.Location:
				return _league.updateEntityByType(entity);

			case Common.Enums.ImpaktDataTypes.Team:
			case Common.Enums.ImpaktDataTypes.PersonnelGroup:
				return _team.updateEntityByType(entity);

			case Common.Enums.ImpaktDataTypes.Season:
			case Common.Enums.ImpaktDataTypes.Game:
				return _season.updateEntityByType(entity);

			default:
				throw new Error('_details update(): entity ImpaktDataType not supported ' + entity.impaktDataType);
		}
	}

}]);