var officeDoors = angular.module('office-doors', [
  'ui.router',
  'ui.bootstrap',
  'ui-notification',
  'angular-svg-round-progress',
  'directive.g+signin',
  'LocalStorageModule'
])

/* Config notificaiton modules */
.config(function(NotificationProvider) {
  NotificationProvider.setOptions({
    delay: 10000,
    startTop: 20,
    startRight: 10,
    verticalSpacing: 20,
    horizontalSpacing: 20,
    positionX: 'center',
    positionY: 'top'
  });
})

/* Config HTTP requests */
.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

/* Config local storage */
.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('od');
}])

.run(['$rootScope', function($rootScope) {

  /* Parse configuration */
  $rootScope.applicationId = "gWXcDDqM73Zpp8BPCMiGCcYxn8HG0lw0VQADFyu4";
  $rootScope.clientKey = "sqNw3QwB30jQDKKv5t9dxFmf5WfD2ap66uCHHdNq";
  Parse.initialize($rootScope.applicationId, $rootScope.clientKey);

  /* Google config */
  $rootScope.clientId = '778736666364-e4v4iod624hrmfa1mlnkulh7c7nhhci6.apps.googleusercontent.com';

  /* Door enabled */
  $rootScope.enabled = true;
}]);
