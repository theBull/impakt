/// <reference path='./base.mdl.ts' />

/**
 * Defines a base service structure with methods that most
 * impakt module-level services will need.
 */
impakt.common.base.service('_base',
	['$rootScope', function($rootScope: any) {
		console.debug('service: impakt.common.base')

		/**
		 * Register all components expected to be made ready. 
		 * 
		 * "Components" are other angular services, controllers,
		 * or directives that need to have been loaded in order for
		 * the editor to be truly ready for service.
		 *
		 * Components can notify to this service when they are
		 * loading and when they have completely loaded. This
		 * service can then in turn identify if it is
		 * ready based on whether all of the components it is
		 * expecting a 'componentLoaded' call from have been
		 * called. Once all expected components have reported
		 * that they are ready, we can use a ready event in the
		 * service to initiate further commands.
		 *
		 * The name of each expected component should match the
		 * string name given to angular to construct the given
		 * component.
		 */

		let components = new Common.Base.ComponentMap();


		this.loadComponent = function(component: Common.Base.Component) {
			//console.log('component loaded', component);

			this.registerComponent(component);

			if (component.loaded)
				component.ready();
		}
		this.registerComponent = function(component: Common.Base.Component) {
			components[component.guid] = component;
		}

	}]);