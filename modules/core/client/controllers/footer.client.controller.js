'use strict';

angular.module('core')
  .controller('controllerFooter', controllerFooter);

// -----------------------------------------------------------------------------------
//
// Controller Footer
//
// -----------------------------------------------------------------------------------
controllerFooter.$inject = ['Authentication', '$rootScope'];
/* @ngInject */
function controllerFooter(Authentication, $rootScope) {
  var footer = this;
  footer.authentication = Authentication;
  footer.side = true;

  $rootScope.$on('$stateChangeSuccess',
    function(event, toState){
      // sidebar if user is logged in or on a project page.
      footer.side = (!!Authentication.user || toState.name.match(/^p\./i)) && toState.name !== 'not-found';
    });


}
