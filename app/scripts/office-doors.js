if(Notification && Notification.permission){
  var _notify = Notification;
}

var officeDoors = angular.module('office-doors', [
  'ui.router',
  'ui.bootstrap',
  'ui-notification',
  'angular-svg-round-progress',
  'directive.g+signin',
  'LocalStorageModule',
  'ngConsole'
])

/* Config notificaiton modules */
.config(function(NotificationProvider) {

  NotificationProvider.setOptions({
    delay: 5000,
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

  /* Pusher config */
  $rootScope.pusher = new Pusher('39430a9932b5bb99242f');
  $rootScope.channel = $rootScope.pusher.subscribe('timbre_devspark');

  /* Slack config */
  $rootScope.slack = {
    'token': '1234567890',
    'channel': '#comidamdq',
    'text': '@here Ya llegó la comida y está esperando en la puerta. El encargado de hoy, que baje a pagar!'
  };

  /* Food delivers */
  $rootScope.companies = [
    { name: "Viandas del Sur", text: "Viandas del Sur"},
    { name: "Micaela", text: "Micaela" },
    { name: "Joya Manteca", text: "Joya Manteca" },
    { name: "Otro", text: "el pedido de comida del antro desconocido al que pidieron" }
  ];

  /* Door enabled */
  $rootScope.enabled = enabled;
}]);
