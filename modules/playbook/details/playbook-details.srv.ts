/// <reference path='./playbook-details.mdl.ts' />

declare var impakt: any;

impakt.playbook.browser.service('_playbookDetails',
[
'$rootScope', 
'$q', 
'$state', 
'__localStorage', 
'__parser',
'_playbook',
function(
	$rootScope: any, 
	$q: any, 
	$state: any,  
	__localStorage: any, 
	__parser: any,
	_playbook: any) {
	console.debug('service: impakt.playbook.browser');

	var self = this;

	// Set browser to expanded or collapsed by default
	this.isCollapsed = true;

	this.init = function() {}

	this.collapseCallback = function() {
		console.log('playbook details collapse (default)');
	}
	this.expandCallback = function() {
		console.log('playbook details expand (default)');
	}

	this.toggleCallback = function(isCollapsed) {
		console.log('playbook browser toggle (default)', isCollapsed);
	}

	this.collapse = function() {
		this.collapseCallback();
	}

	this.oncollapse = function(callback) {
		this.collapseCallback = callback;
	}

	this.toggle = function() {
		this.isCollapsed = !this.isCollapsed;
		this.isCollapsed ? this.collapse() : this.expand();
		this.toggleCallback(this.isCollapsed);
	}

	this.ontoggle = function(callback) {
		this.toggleCallback = callback;
	}

	this.expand = function() {
		this.isCollapsed = false;
		this.expandCallback();
	}

	this.onexpand = function(callback) {
		this.expandCallback = callback;
	}

	$rootScope.$on('playbook-details.toggle',
		function(e: any, data: any) {
			
		});

	$rootScope.$on('playbook-details.collapse',
		function(e: any, data: any) {
			self.collapse();
		});

	this.init();

}]);