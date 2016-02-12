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

    return service;
}]);
