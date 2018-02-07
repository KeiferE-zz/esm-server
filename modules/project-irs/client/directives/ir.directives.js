'use strict';

angular.module ('irs')

// -------------------------------------------------------------------------
//
// directive for listing irs
//
// -------------------------------------------------------------------------
  .directive ('tmplIrList', function () {
    return {
      restrict: 'E',
      templateUrl: 'modules/project-irs/client/views/ir-list.html',
      controller: 'controllerIrList',
      controllerAs: 'data'
    };
  })

// -------------------------------------------------------------------------
//
// directive for adding or editing a ir
//
// -------------------------------------------------------------------------
  .directive ('editIrModal', ['$uibModal','$rootScope', function ($uibModal, $rootScope) {
    return {
      restrict: 'A',
      scope: {
        collection: '=',
        ir: '=',
        mode: '@'
      },
      link : function (scope, element) {
        element.on ('click', function () {
          var modalView = $uibModal.open ({
            animation    : true,
            templateUrl  : 'modules/project-irs/client/views/ir-edit.html',
            controller   : 'controllerEditIrModal',
            controllerAs : 'd',
            scope        : scope,
            size         : 'lg'
          });
          modalView.result.then (function (/* model */) {
            $rootScope.$broadcast('refreshIrList');
          }, function () {});
        });
      }
    };
  }]);
