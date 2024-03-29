/// <reference path='../common.ts' />

module Common.Constants {
	export const DEFAULT_GRID_COLS = 100;
	export const DEFAULT_GRID_ROWS = 100;

	export const COMMON_URL = 'common/';
	export const MODULES_URL = 'modules/';
	export const PLAYBOOK_URL = 'playbook/';
	export const CONTEXTMENUS_URL = 'contextmenus/';

	/**
	 * 
	 * Contextmenu template URLs
	 * 
	 */
	export const DEFAULT_CONTEXTMENU_TEMPLATE_URL = [
		Common.Constants.COMMON_URL,
		Common.Constants.CONTEXTMENUS_URL,
		'default-contextmenu.tpl.html'
	].join('');

	export const EDITOR_ROUTENODE_CONTEXTMENU_TEMPLATE_URL =[
		Common.Constants.MODULES_URL,
		Common.Constants.PLAYBOOK_URL,
		Common.Constants.CONTEXTMENUS_URL,
		'routeNode/contextmenu-routeNode.tpl.html'
	].join('');

	export const PLAY_CONTEXTMENU_TEMPLATE_URL = [
		Common.Constants.MODULES_URL,
		Common.Constants.PLAYBOOK_URL,
		Common.Constants.CONTEXTMENUS_URL,
		'play/contextmenu-play.tpl.html'
	].join('');

	export const PLAYER_CONTEXTMENU_TEMPLATE_URL = [
		Common.Constants.MODULES_URL,
		Common.Constants.PLAYBOOK_URL,
		Common.Constants.CONTEXTMENUS_URL,
		'player/contextmenu-player.tpl.html'
	].join('');
}