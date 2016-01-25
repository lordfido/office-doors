officeDoors.service('services',
  ['$http', '$rootScope', '$q',
  function($http, $rootScope, $q) {
    var service = {};

    /* Validate the user on uor database */
    service.login = function(params){
      return $http({
        method: 'GET',
        url: SVC_URL.login + '?nombre=' + params.name + '&email=' + params.email + '&userId=' + params.userId
      })
    };

    /* Open the door */
    service.openDoors = function(params){
      return $http({
        method: 'POST',
        url: SVC_URL.openDoors,
        data: params
      });
    };

    /* Is mobile device */
    service.isMobile = function(){
      if( window.innerWidth >= 680){
        return false;
      }
      else{
        return true;
      }
    };

    /* Open the door */
    service.talk = function(params){
      return $http({
        method: 'POST',
        url: SVC_URL.talk,
        data: params
      });
    };

    return service;
}]);
