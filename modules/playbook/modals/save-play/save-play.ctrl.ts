/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.savePlay.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_playbook', 
'formation',
'personnel',
'assignmentCollection', 

function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any,
	formation: Playbook.Models.Formation,
	personnel: Playbook.Models.Personnel, 
	assignmentCollection: Playbook.Models.AssignmentCollection
) {

	$scope.playName = '';
	$scope.formation = formation;
	$scope.personnel = personnel;
	$scope.assignmentCollection = assignmentCollection;
	$scope.assignments = assignmentCollection.toJsonArray();

	console.log('play assignments: ', $scope.assignments);

	$scope.ok = function () {
		let play = new Playbook.Models.Play();
		play.name = $scope.playName;
		play.formation = $scope.formation;
		play.personnel = $scope.personnel;
		play.assignments = $scope.assignmentCollection;
		
		console.log($scope.playName, $scope.assignments);
		
		// _playbook.updateFormation(data)
		// .then(function(response) {
		// 	console.log(response);
		// }, function(err) {
		// 	console.error(err);
		// });
		
		// _playbook.createPlay(play).then(function(data) {
		// 	console.log(data);
		// }, function(error) {
		// 	console.error(error);
		// });
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);