// Playbook service
var playbookService = angular.module('App.playbookServices', [])
.factory('PlaybookService', function() {
	
	var BASE_URL = '';
	var API_ENDPOINT = '';

	var self = {
		playbooks: null,
		editorTabs: [],

		// GET methods
		getAllPlaybooks: getAllPlaybooks,
		getPlayById: getPlayById,

		// SET methods
		setEditorTabs: setEditorTabs,

		// view data and state methods
		getPlaybookViews: getPlaybookViews,
		addPlaybookView: addPlaybookView,

		// save method
		savePlay: savePlay
	};

	// maintain the state of playbook views. 
	// If a view is set (playbookViews[viewName] returns non-null),
	// the view has been opened. If the view has a keepAlive flag set
	// to TRUE, the view will not be re-rendered or re-included when
	// navigating to and from the view. In this way, the view and its
	// corresponding data will persist in the UI.
	var playbookViews = {};

	function setEditorTabs(tabs) {
		self.editorTabs = tabs;
	}

	function getPlaybookViews(viewName) {
		return playbookViews[viewName];
	}

	// Add (register) a new playbook view with the service to
	// maintain view states and data.
	// TODO: create a separate PlaybookView object definition
	function addPlaybookView(viewName, options) {		
		playbookViews[viewName] = new Impakt.View(viewName, options);
	}

	// retrieves all playbook data
	// TODO: implement *for the given user*
	function getAllPlaybooks(callback, forceRefresh) {

		// check to see if there is already a copy of the playbooks
		// and whether the user wants to forcibly retrieve them
		if(!self.playbooks || forceRefresh) {
			return $.getJSON(api.getPlaybooks, function(playbookResults) {
				var treeData = [];
				for(var i = 0; i < playbookResults.length; i++) {
					treeData.push(
						convertToDataTree(playbookResults[i])
					);
				}

				// Save a reference to the current playbooks
				self.playbooks = treeData;
				callback(treeData);
			});
		} 
		// there exists a saved copy of the playbooks and the user
		// does not want to forcibly retrieve them
		else {
			callback(self.playbooks);
		}			
	}

	function savePlay(saveData, callback) {
		//var headers = { "X-HTTP-Method-Override": 'GET' };
        var options = {
            url: api.savePlay,
            type: 'POST',
            //contentType: "application/json",
            data: saveData,
            //dataType: 'json',
            //headers: headers,
            //xhrFields: {
            //    withCredentials: true
            //},
            //processData: processData
        };
        console.log(saveData);
		return $.ajax(options)
			.done(function(data) {
				console.log('success');
				callback(data);
			})
			.fail(function(err) {
				console.log(err);
				callback('error');
			})
	}

	// retrieve parent path breadcrumbs
	function getBreadcrumb(itemId) {

	}

	// rawData is an array of data
	function convertToDataTree(rawData, parentId, parentPath) {
		if(!rawData || !rawData.Items) {
			var convertedItem = convertItem(rawData, parentId, parentPath);
			delete convertedItem.items;
			return convertedItem;
		} 
		else {
			var tempConvertedData = convertItem(rawData, parentId, parentPath);
			var parentId = tempConvertedData.id;
			var parentPath = tempConvertedData.parentPath + ' > ';
			for(var i = 0; i < rawData.Items.length; i++) {
				tempConvertedData.items.push(
					convertToDataTree(rawData.Items[i], parentId, parentPath)
				);
			}
			return tempConvertedData;
		}
	}
	// Convert the item from database-esque language to front-end language
	function convertItem(data, parentId, parentPath) {
		return {
			'type': data.DataType,
			'parentId': parentId || null,
			'parentPath': (parentPath || '') + data.DataObject.Name,
			'id': data.DataKey,
			'text': data.DataObject.Name,
			'items': []
		};
	}

	function getPlayById(id, callback) {
		if(id && id != 0) {
			var options = {
	            url: api.getPlayById,
	            type: 'POST',
	            //contentType: "application/json",
	            data: {id: id},
	            //dataType: 'json',
	            headers: { "X-HTTP-Method-Override": 'GET' },
	            //xhrFields: {
	            //    withCredentials: true
	            //},
	            //processData: processData
	        };

			return $.ajax(options)
				.done(function(data) {
					data = JSON.parse(data);
					var playId = data.id;
					// retreive the breadcrumb data for this play
					data['breadcrumb'] = getBreadcrumb(playId, self.playbooks);
					callback(data);
				})
				.fail(function(err) {
					console.log(err);
					callback([]);
				});
		}
	}

	function getBreadcrumb(id, data) {
		if(!data) {
			return '';
		}
		else {
			for(var i = 0; i < data.length; i++) {
				if(data[i].id == id)
					return data[i].parentPath;
				else
					return getBreadcrumb(id, data[i].items);
			}
		}
	}

	// DEBUGGING ONLY - PSEUDO API MAPPING
	var api = {
		getPlaybooks: 'data/playbook.json',
		getPlayById: 'dev_scripts/getPlayById.php',
		savePlay: 'dev_scripts/save.php'
	}

	return self;
});
