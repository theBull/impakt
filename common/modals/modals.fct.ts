/// <reference path='./modals.mdl.ts' />

impakt.common.modals.factory('__modals', [
	'$uibModal',
	function($uibModal: any) {

		var self = {
			open: open	
		}

		function open(size, templateUrl, controllerName, resolveData) {
			console.log('open modal', resolveData);
			for(let key in resolveData) {
				if(typeof resolveData[key] != 'function') {
					throw Error(
						['Modal resolve data must be given ',
							'as an anonymous function which ',
							'returns a value.',
							' | key: ', key,
							' | data: ', resolveData[key]
						].join('')
					);
				}
			}
			return $uibModal.open({
				animation: true,
				size: size,
				templateUrl: templateUrl,
				controller: controllerName,
				resolve: resolveData
			});			
		}



		return self;
	}]);
