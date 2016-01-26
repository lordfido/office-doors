officeDoors.service('services',
  ['$http', '$rootScope', '$q', 'Notification',
  function($http, $rootScope, $q, Notification) {
    var service = {};

    /* Validate the user on uor database */
    service.login = function(params){
      return $http({
        method: 'GET',
        url: SVC_URL.login + '?nombre=' + params.name + '&email=' + params.email + '&userId=' + params.userId
      });
    };

    /* Open the door */
    service.openDoors = function(params){
      return $http({
        method: 'POST',
        url: SVC_URL.openDoors,
        data: params
      });
    };

    service.announceFood = function(params){
      return $http({
        method: 'POST',
        url: SVC_URL.announceFood,
        data: params
      });
    }

    /* Say something */
    service.talk = function(params){
      return $http({
        method: 'POST',
        url: SVC_URL.talk,
        data: params
      });
    };

    /* Is mobile device */
    service.isMobile = function(){

      /* Declare mobile OOSS */
      var OOSS = new Array();
      OOSS.push("android");
      OOSS.push("iphone os");
      OOSS.push("windows phone");
      OOSS.push("bb10");
      OOSS.push("rim tablet os");

      /* Go through the list */
      for(var x in OOSS){

        /* If there is a coincidence */
        if( navigator.userAgent.toLowerCase().indexOf(OOSS[x]) > 0 && window.innerWidth <= 680){
          return true;
          break;
        }
      }
      return false;
    };

    /* Notify */
    service.notify = function(text){
      if( _notify && _notify.permission && _notify.permission === "granted" ){
        var options = {
          "body": text,
          "icon": "icons/favicon.png"
        }
        var notification = new _notify("DevSpark DoorBell", options);
      }
      else{
        Notification(text);
      }
    };

    /* Notify an error */
    service.notifyError = function(text){
      if( _notify && _notify.permission && _notify.permission === "granted" ){
        var options = {
          "body": text,
          "icon": "icons/favicon.png"
        }
        var notification = new _notify("Error", options);
      }
      else{
        Notification.error(text);
      }
    }

    return service;
}]);
