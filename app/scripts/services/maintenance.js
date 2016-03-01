officeDoors.service('maintenanceServices',
  ['$http', '$rootScope',
  function($http, $rootScope) {
    var service = {};

    /* Camera fix */
    service.cameraFix = function(){
      return $http({
        method: 'GET',
        url: SVC_URL.cameraFix
      });
    };

    service.startup = function(){
      return $http({
        method: 'GET',
        url: SVC_URL.startup
      });
    };

    service.restart = function(){
      return $http({
        method: 'GET',
        url: SVC_URL.restartServer
      });
    };

    return service;
}]);
