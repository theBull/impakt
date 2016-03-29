/// <reference path='../../nav/nav.fct.ts' />
/// <reference path='./playbook-nav.mdl.ts' />

declare var impakt: any;

impakt.playbook.nav.service('_playbookNav', 
['__nav', '_playbook', function(__nav: any, _playbook: any) {

	console.log('_playbookNav (component service)');

}]);
