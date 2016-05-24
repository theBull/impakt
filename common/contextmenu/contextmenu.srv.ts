/// <reference path='./contextmenu.mdl.ts' />

impakt.common.contextmenu.service('_contextmenu', [
function() {

	var closeCallback: Function = function() {}
	var openCallback: Function = function(data) {}

	this.contextmenuData = null;

	this.open = function(data: Common.Models.ContextmenuData) {
		this.contextmenuData = data;
		openCallback(data);
	}
	this.onopen = function(callback: Function) {
		openCallback = callback;
	}
	
	this.close = function() {
		this.data = null;
		closeCallback();
	}	
	this.onclose = function(callback: any) {
		closeCallback = callback;
	}
	
	this.calculatePosition = function() {
		// todo
	}

	this.getData = function() {
		return Common.Utilities.isNotNullOrUndefined(this.contextmenuData) ? this.contextmenuData.data : null;
	}

}]);
