/// <reference path='./localStorage.mdl.ts' />

impakt.common.localStorage.factory('__localStorage', [
	'LOCAL_STORAGE',
	function(LOCAL_STORAGE: any) {

		var self = {
			getItem: getItem,
			setItem: setItem,
			getAccessToken: getAccessToken,
			setAccessToken: setAccessToken,
			clearAccessToken: clearAccessToken,
			getAccessTokenExpiration: getAccessTokenExpiration,
			getUserName: getUserName,
			getOrganizationKey: getOrganizationKey,
			isDefaultEditorInfoSet: isDefaultEditorInfoSet, 

			getDefaultEditorInfo: getDefaultEditorInfo,
			setDefaultEditorInfo: setDefaultEditorInfo,
			
			getDefaultPlaybookKey: getDefaultPlaybookKey,
			setDefaultPlaybookKey: setDefaultPlaybookKey,
			resetDefaultPlaybookKey: resetDefaultPlaybookKey,
			getDefaultPlaybookUnitType: getDefaultPlaybookUnitType,
			setDefaultPlaybookUnitType: setDefaultPlaybookUnitType,
			resetDefaultPlaybookUnitType: resetDefaultPlaybookUnitType,
			resetDefaultPlaybook: resetDefaultPlaybook,

			getDefaultEditorType: getDefaultEditorType,
			setDefaultEditorType: setDefaultEditorType,
			resetDefaultEditorType: resetDefaultEditorType,

			getDefaultEditorItemKey: getDefaultEditorItemKey,
			setDefaultEditorItemKey: setDefaultEditorItemKey,
			resetDefaultEditorItemKey: resetDefaultEditorItemKey,

			getDefaultEditorItemType: getDefaultEditorItemType,
			setDefaultEditorItemType: setDefaultEditorItemType,
			resetDefaultEditorItemType: resetDefaultEditorItemType,
			resetDefaultEditorItem: resetDefaultEditorItem,

			signout: signout
			
		}

		function signout() {
			self.clearAccessToken();

			self.resetDefaultEditorItem();
			self.resetDefaultPlaybook();
		}

		function getItem(key: string) {
			return localStorage.getItem(key);
		}

		function setItem(key: string, value: any) {
			localStorage.setItem(key, value);
		}

		/**
		 * 
		 * App-specific settings
		 * 
		 */
		
		// Access token
		function getAccessToken() {
			return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
		}
		function getAccessTokenExpiration() {
			return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES);
		}
		function getUserName() {
			return localStorage.getItem(LOCAL_STORAGE.USER_NAME);
		}
		function getOrganizationKey() {
			return localStorage.getItem(LOCAL_STORAGE.ORGANIZATION_KEY);
		}
		function setAccessToken(data: any) {
			self.setItem(LOCAL_STORAGE.ACCESS_TOKEN, data['access_token']);
			self.setItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES, data['.expires']);
			self.setItem(LOCAL_STORAGE.USER_NAME, data['userName']);
			self.setItem(LOCAL_STORAGE.ORGANIZATION_KEY, data['organizationKey']);
		}
		function clearAccessToken() {
			self.setItem(LOCAL_STORAGE.ACCESS_TOKEN, null);
			self.setItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES, null);
			self.setItem(LOCAL_STORAGE.USER_NAME, null);
			self.setItem(LOCAL_STORAGE.ORGANIZATION_KEY, null);
		}

		// Default Playbook Key
		function getDefaultPlaybookKey() {
			return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_KEY));
		}
		function setDefaultPlaybookKey(key: number) {
			self.setItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_KEY, key);
		}
		function resetDefaultPlaybookKey() {
			self.setDefaultPlaybookKey(-1);
		}
		function getDefaultPlaybookUnitType() {
			return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_UNIT_TYPE));	
		}
		function setDefaultPlaybookUnitType(type: number) {
			self.setItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_UNIT_TYPE, type);
		}
		function resetDefaultPlaybookUnitType() {
			self.setDefaultPlaybookUnitType(-1);
		}
		function resetDefaultPlaybook() {
			self.resetDefaultPlaybookKey();
			self.resetDefaultPlaybookUnitType();
		}



		function isDefaultEditorInfoSet() {
			let info = self.getDefaultEditorInfo();
			return info && info.playbookKey > 0 && info.editorType >= 0
				&& info.editorItemKey > 0 && info.editorItemType >= 0;
		}
		function setDefaultEditorInfo(
			playbookKey: number, 
			editorType: number, 
			editorItemKey: number, 
			editorItemType: number
		) {
			self.setDefaultPlaybookKey(playbookKey);
			self.setDefaultEditorType(editorType);
			self.setDefaultEditorItemKey(editorItemKey);
			self.setDefaultEditorItemType(editorItemType);
		}
		function getDefaultEditorInfo() {
			return {
				playbookKey: self.getDefaultPlaybookKey(),
				editorType: self.getDefaultEditorType(),
				editorItemKey: self.getDefaultEditorItemKey(),
				editorItemType: self.getDefaultEditorItemType()
			};
		}
		function getDefaultEditorType() {
			return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_TYPE));
		}
		function setDefaultEditorType(type: number) { 
			self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_TYPE, type);
		}
		function resetDefaultEditorType() {
			self.setDefaultEditorType(-1);
		}
		function getDefaultEditorItemKey() {
			return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_KEY));
		}
		function setDefaultEditorItemKey(key: number) { 
			self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_KEY, key);
		}
		function resetDefaultEditorItemKey() {
			self.setDefaultEditorItemKey(-1);
		}
		function getDefaultEditorItemType() {
			return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_TYPE));
		} 
		function setDefaultEditorItemType(type: number) { 
			self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_TYPE, type);
		} 
		function resetDefaultEditorItemType() {
			self.setDefaultEditorItemType(-1);
		}
		function resetDefaultEditorItem() {
			self.resetDefaultEditorType();
			self.resetDefaultEditorItemKey();
			self.resetDefaultEditorItemType();
		}

		return self;
	}]);
