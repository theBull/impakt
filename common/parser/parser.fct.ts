/// <reference path='./parser.mdl.ts' />

impakt.common.parser.factory('__parser', [
	'PARSER',
	function(PARSER: any) {

		var self = {
			camelCaseToSpace: camelCaseToSpace,
			convertEnumToList: convertEnumToList,
			toJson: toJson
		}		

		function camelCaseToSpace(str: string, capitalizeFirst?: boolean): string {
			return Common.Utilities.camelCaseToSpace(str, capitalizeFirst);
		}

		function convertEnumToList(obj: any) {
			return Common.Utilities.convertEnumToList(obj);
		}

		/**
		 * takes a complex javascript object
		 * (containing primitives, objects & functions)
		 * and returns a json object containing entries
		 * which are explicitly defined by the object's
		 * implementation of a 'toJson()' method. 
		 * 
		 * If the object does not implement a 'toJson()' method,
		 * the object returned by this method will be null.
		 *
		 * If the object contains child objects, each child object
		 * will be recursively searched for a 'toJson()' method, and
		 * the same logic is applied.
		 *
		 * Functions stored within the json object will be dropped.
		 */
		function toJson(obj: any): any {
			return Common.Utilities.toJson(obj);
		}

		return self;
	}]);
