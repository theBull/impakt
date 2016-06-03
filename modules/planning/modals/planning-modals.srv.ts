/// <reference path='./planning-modals.mdl.ts' />

impakt.planning.modals.service('_planningModals', [
'$q',
'__modals',
function($q: any, __modals: any) {


	/**
	 * 
	 * PLAN
	 * 
	 */
	this.createPlan = function(plan?: Planning.Models.Plan) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-plan/create-plan.tpl.html',
			'planning.modals.createPlan.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(createdPlan: Planning.Models.Plan) {
			console.log(createdPlan);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createPlanDuplicate = function(plan: Planning.Models.Plan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-plan-duplicate-error/create-plan-duplicate-error.tpl.html',
			'planning.modals.createPlanDuplicateError.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(createdPlan) {
			console.log(createdPlan);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deletePlan = function(plan: Planning.Models.Plan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/delete-plan/delete-plan.tpl.html',
			'planning.modals.deletePlan.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	
	this.savePlan = function(plan: Planning.Models.Plan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/save-plan/save-plan.tpl.html',
			'planning.modals.savePlan.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

	


	/**
	 * 
	 * practicePlan
	 * 
	 */
	this.createPracticePlan = function(plan?: Planning.Models.Plan) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-practice-plan/create-practice-plan.tpl.html',
			'planning.modals.createPracticePlan.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(createdPracticePlan: Planning.Models.PracticePlan) {
			console.log(createdPracticePlan);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createPracticePlanDuplicate = function(practicePlan: Planning.Models.PracticePlan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-practice-plan-duplicate-error/create-practice-plan-duplicate-error.tpl.html',
			'planning.modals.createPracticePlanDuplicateError.ctrl',
			{
				practicePlan: function() {
					return practicePlan;
				}
			}
		);

		modalInstance.result.then(function(createdPracticePlan) {
			console.log(createdPracticePlan);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deletePracticePlan = function(practicePlan: Planning.Models.PracticePlan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/delete-practice-plan/delete-practice-plan.tpl.html',
			'planning.modals.deletePracticePlan.ctrl',
			{
				practicePlan: function() {
					return practicePlan;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	
	this.savePracticePlan = function(practicePlan: Planning.Models.PracticePlan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/save-practice-plan/save-practice-plan.tpl.html',
			'planning.modals.savePracticePlan.ctrl',
			{
				practicePlan: function() {
					return practicePlan;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

	/**
	 * 
	 * gamePlan
	 * 
	 */
	this.createGamePlan = function(plan?: Planning.Models.Plan) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-game-plan/create-game-plan.tpl.html',
			'planning.modals.createGamePlan.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(createdGamePlan: Planning.Models.GamePlan) {
			console.log(createdGamePlan);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createGamePlanDuplicate = function(gamePlan: Planning.Models.GamePlan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-game-plan-duplicate-error/create-game-plan-duplicate-error.tpl.html',
			'planning.modals.createGamePlanDuplicateError.ctrl',
			{
				gamePlan: function() {
					return gamePlan;
				}
			}
		);

		modalInstance.result.then(function(createdGamePlan) {
			console.log(createdGamePlan);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deleteGamePlan = function(gamePlan: Planning.Models.GamePlan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/delete-game-plan/delete-game-plan.tpl.html',
			'planning.modals.deleteGamePlan.ctrl',
			{
				gamePlan: function() {
					return gamePlan;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	
	this.saveGamePlan = function(gamePlan: Planning.Models.GamePlan) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/save-game-plan/save-game-plan.tpl.html',
			'planning.modals.saveGamePlan.ctrl',
			{
				gamePlan: function() {
					return gamePlan;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

	/**
	 * 
	 * practiceschedule
	 * 
	 */
	this.createPracticeSchedule = function(plan?: Planning.Models.Plan) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-practice-schedule/create-practice-schedule.tpl.html',
			'planning.modals.createPracticeSchedule.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(createdPracticeSchedule: Planning.Models.PracticeSchedule) {
			console.log(createdPracticeSchedule);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createPracticeScheduleDuplicate = function(practiceSchedule: Planning.Models.PracticeSchedule) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-practice-schedule-duplicate-error/create-practice-schedule-duplicate-error.tpl.html',
			'planning.modals.createPracticeScheduleDuplicateError.ctrl',
			{
				practiceSchedule: function() {
					return practiceSchedule;
				}
			}
		);

		modalInstance.result.then(function(createdPracticeSchedule) {
			console.log(createdPracticeSchedule);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deletePracticeSchedule = function(practiceSchedule: Planning.Models.PracticeSchedule) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/delete-practice-schedule/delete-practice-schedule.tpl.html',
			'planning.modals.deletePracticeSchedule.ctrl',
			{
				practiceSchedule: function() {
					return practiceSchedule;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	
	this.savePracticeSchedule = function(practiceSchedule: Planning.Models.PracticeSchedule) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/save-practice-schedule/save-practice-schedule.tpl.html',
			'planning.modals.savePracticeSchedule.ctrl',
			{
				practiceSchedule: function() {
					return practiceSchedule;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

	/**
	 * 
	 * scout card
	 * 
	 */
	this.createScoutCard = function(plan?: Planning.Models.Plan) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-scout-card/create-scout-card.tpl.html',
			'planning.modals.createScoutCard.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(createdScoutCard: Planning.Models.ScoutCard) {
			console.log(createdScoutCard);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createScoutCardDuplicate = function(scoutCard: Planning.Models.ScoutCard) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-scout-card-duplicate-error/create-scout-card-duplicate-error.tpl.html',
			'planning.modals.createScoutCardDuplicateError.ctrl',
			{
				scoutCard: function() {
					return scoutCard;
				}
			}
		);

		modalInstance.result.then(function(createdScoutCard) {
			console.log(createdScoutCard);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deleteScoutCard = function(scoutCard: Planning.Models.ScoutCard) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/delete-scout-card/delete-scout-card.tpl.html',
			'planning.modals.deleteScoutCard.ctrl',
			{
				scoutCard: function() {
					return scoutCard;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	
	this.saveScoutCard = function(scoutCard: Planning.Models.ScoutCard) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/save-scout-card/save-scout-card.tpl.html',
			'planning.modals.saveScoutCard.ctrl',
			{
				scoutCard: function() {
					return scoutCard;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

	/**
	 * 
	 * QBWristband
	 * 
	 */
	this.createQBWristband = function(plan?: Planning.Models.Plan) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-QBWristband/create-QBWristband.tpl.html',
			'planning.modals.createQBWristband.ctrl',
			{
				plan: function() {
					return plan;
				}
			}
		);

		modalInstance.result.then(function(createdQBWristband: Planning.Models.QBWristband) {
			console.log(createdQBWristband);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createQBWristbandDuplicate = function(QBWristband: Planning.Models.QBWristband) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/create-QBWristband-duplicate-error/create-QBWristband-duplicate-error.tpl.html',
			'planning.modals.createQBWristbandDuplicateError.ctrl',
			{
				QBWristband: function() {
					return QBWristband;
				}
			}
		);

		modalInstance.result.then(function(createdQBWristband) {
			console.log(createdQBWristband);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deleteQBWristband = function(QBWristband: Planning.Models.QBWristband) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/delete-QBWristband/delete-QBWristband.tpl.html',
			'planning.modals.deleteQBWristband.ctrl',
			{
				QBWristband: function() {
					return QBWristband;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	
	this.saveQBWristband = function(QBWristband: Planning.Models.QBWristband) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/save-QBWristband/save-QBWristband.tpl.html',
			'planning.modals.saveQBWristband.ctrl',
			{
				QBWristband: function() {
					return QBWristband;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}


	/**
	 * 
	 * NEW PLANNING EDITOR TAB
	 * 
	 */
	this.newPlanningEditorTab = function() {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/planning/modals/new-planning-editor-tab/new-planning-editor-tab.tpl.html',
			'planning.modals.newPlanningEditorTab.ctrl',
			{}
		);

		modalInstance.result.then(function() {
			d.resolve();
		}, function(results) {
			d.reject();
		});

		return d.promise;
	}

	

}]);