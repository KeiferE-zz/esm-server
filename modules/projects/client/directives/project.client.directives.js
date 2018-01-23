'use strict';

angular.module('project')
	.directive('modalProjectSchedule', directiveProjectSchedule)
	.directive('tmplProjectTombstone', directiveProjectTombstone)
	.directive('modalProjectImport', directiveModalProjectImport)

	.directive('tmplProjectInitiated', directiveProjectInitiated)
	.directive('tmplProjectActivities', directiveProjectActivities);

// -----------------------------------------------------------------------------------
//
// DIRECTIVE: Modal Project Schedule
//
// -----------------------------------------------------------------------------------
directiveProjectSchedule.$inject = ['$uibModal'];
/* @ngInject */
function directiveProjectSchedule($uibModal) {
	var directive = {
		restrict: 'E',
		templateUrl: 'modules/projects/client/views/project-partials/project-schedule.html',
		scope: {
			project: '='
		},
		controller: function($scope, ENV) {
			$scope.environment = ENV;
		}
	};
	return directive;
}
// -----------------------------------------------------------------------------------
//
// DIRECTIVE: Modal Project Entry
//
// -----------------------------------------------------------------------------------
directiveModalProjectImport.$inject = ['$uibModal', '$state', '$rootScope', 'ProjectModel'];
/* @ngInject */
function directiveModalProjectImport($uibModal, $state, $rootScope, sProjectModel) {
	var directive = {
		restrict:'A',
		scope : {
			project: '='
		},
		link : function(scope, element, attrs) {
			element.on('click', function() {
				var modalProjectEntry = $uibModal.open({
					animation: true,
					templateUrl: 'modules/projects/client/views/project-partials/modal-project-import.html',
					controller: 'controllerModalProjectImport',
					controllerAs: 'projectImport',
					resolve: {
						rProject: function () {
							return scope.project;
						}
					},
					size: 'lg'
				});
				modalProjectEntry.result.then(function (data) {
					if ($state.current.name === 'projects') {
						// reload the complete projects list
						$rootScope.$broadcast('refreshProjectsList');
					} else {
						$rootScope.$broadcast('refreshProject');
						$rootScope.$broadcast('refreshDocumentList');
					}
				}, function () {});
			});
		}
	};
	return directive;
}
// -----------------------------------------------------------------------------------
//
// DIRECTIVE: Project Tombstone Horizontal
//
// -----------------------------------------------------------------------------------
directiveProjectTombstone.$inject = ['Authentication','CodeLists'];
/* @ngInject */
function directiveProjectTombstone(Authentication, CodeLists) {
    var directive = {
        restrict: 'E',
        templateUrl: 'modules/projects/client/views/project-partials/project-tombstone.html',
        scope: {
            project: '='
        },
        controller: function($scope, ENV, Authentication) {
            var c = this;
            $scope.environment = ENV;
            $scope.CodeLists = CodeLists;
            c.isEao = (Authentication.user && Authentication.user.roles.indexOf('eao') > -1);
			c.isUser = (Authentication.user);
        },
		
        controllerAs: 'c'
    };
    return directive;
}
// -----------------------------------------------------------------------------------
//
// DIRECTIVE: Project Initiated
// Used
//
// -----------------------------------------------------------------------------------
function directiveProjectInitiated() {
	var directive = {
		restrict: 'E',
		replace: true,
		templateUrl: 'modules/projects/client/views/project-partials/project-initiated.html'
	};
	return directive;
}
directiveProjectActivities.$inject = [];
/* @ngInject */
function directiveProjectActivities() {
	var directive = {
		restrict: 'E',
		templateUrl: 'modules/projects/client/views/project-partials/project-activities.html',
		controller: 'controllerProjectActivities',
		scope: {
			project: '='
		}
	};
	return directive;
}