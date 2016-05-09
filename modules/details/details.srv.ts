/// <reference path='./details.mdl.ts' />

impakt.details.service('_details',
[
'_playbook',
function(
	_playbook: any
) {
	
	this.selectedElements = new Common.Models.ActionableCollection();
	this.state = {
		collapsed: true
	};

	let self = this;
	this.selectedElements.onModified(function(collection: any) {
		if(collection.hasElements())
			self.state.collapsed = false;
	});

	this.updatePlay = function(play: Common.Models.Play) {
		_playbook.updatePlay(play);
	}

	this.delete = function(entity: Common.Interfaces.IActionable) {
		_playbook.deleteEntityByType(entity).then(function() {
			
		}, function(err) {
		
		});
	}

}]);