/// <reference path='./playbook-contextmenus-routeNode.mdl.ts' />

impakt.playbook.contextmenus.routeNode.service(
	'_playbookContextmenusRouteNode',
	['__contextmenu', '__parser', 
	function(__contextmenu: any, __parser: any) {

		this.context = __contextmenu.getContext();
		this.actions = __parser.convertEnumToList(Playbook.Models.RouteNodeActions);

		this.init = function() {
			let self = this;
			__contextmenu.onContextUpdate(function(context) {
				self.context = context;
			});
		}

		this.getActions = function() {
			return __parser.convertEnumToList(Playbook.Models.RouteNodeActions);
		}

		this.selectAction = function(action) {
			this.context.setAction(parseInt(Playbook.Models.RouteNodeActions[action]));
			__contextmenu.close();
		}

		console.log('_playbookContextmenusRouteNode service loaded');
		this.init();
	}]);