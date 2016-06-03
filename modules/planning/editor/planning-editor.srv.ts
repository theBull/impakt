/// <reference path='./planning-editor.mdl.ts' />

impakt.planning.editor.service('_planningEditor', [
'_planning',
function(
	_planning: any
) {

	let self = this;
	this.practicePlans = impakt.context.Planning.editor.practicePlans;
	this.tabs = new Planning.Models.PlanningEditorTabCollection();
	this.currentTab = null;

	this.init = function() {
		if(Common.Utilities.isNotNullOrUndefined(this.practicePlans) &&
			Common.Utilities.isNotNullOrUndefined(this.tabs)) {
			this.practicePlans.forEach(function(practicePlan: Planning.Models.PracticePlan, index: number) {
				let matchingTab = self.tabs.filterFirst(function(tab: Planning.Models.PlanningEditorTab, index: number) {
					return tab.data.guid == practicePlan.guid;
				});

				if(Common.Utilities.isNullOrUndefined(matchingTab)) {
					// Tab doesn't exist, create one
					self.addTab(practicePlan);
				}
			});
			this.activateTab(this.tabs.first());
		}
	}

	this.addTab = function(data: Common.Interfaces.IActionable) {
		if (Common.Utilities.isNullOrUndefined(data))
			return;

		// determine whether the given data already exists within a tab,
		// if so, simply focus the tab
		let existingTab = this.tabs.filterFirst(function(tab: Planning.Models.PlanningEditorTab, index: number) {
			return tab.data.guid == data.guid;
		});
		if(Common.Utilities.isNotNullOrUndefined(existingTab)) {

			return;
		}

		this.tabs.add(new Planning.Models.PlanningEditorTab(data));
	}

	this.close = function(planningEditorTab: Planning.Models.PlanningEditorTab) {
	
		let dataType = planningEditorTab.data.impaktDataType;
		switch (dataType) {
			case Common.Enums.ImpaktDataTypes.PracticePlan:
				this.practicePlans.remove(planningEditorTab.data.guid);
				break;
		}

		let tabToActivate = this.tabs.getNext(planningEditorTab.guid) ||
			this.tabs.getPrevious(planningEditorTab.guid);

		let removedTab = this.tabs.remove(planningEditorTab.guid);
		if (removedTab.selected && Common.Utilities.isNotNullOrUndefined(tabToActivate)) {
			this.activateTab(tabToActivate);
		}
	}

	this.activateTab = function(tab: Planning.Models.PlanningEditorTab) {
		if (Common.Utilities.isNullOrUndefined(tab))
			return;

		this.tabs.select(tab);
		this.currentTab = tab;
	}


}]);