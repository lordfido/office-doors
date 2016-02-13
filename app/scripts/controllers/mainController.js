officeDoors.controller('mainController',
  ['$scope', '$rootScope', '$timeout', 'services', 'maintenanceServices', '$uibModal', 'localStorageService',
  function ($scope, $rootScope, $timeout, services, maintenanceServices, $uibModal, localStorageService) {

    var colorClosed = '#d9534f';
    var colorOpen = '#5cb85c';
    var animationStart;
    var lastCheck;
    var coded = "";
    var notifTimeout;

    $scope.init = function(){

      /* App status */
      $scope.loaded = true;
      $scope.isMobile = services.isMobile();

      /* App config */
      $scope.enabled = $rootScope.enabled;
      $scope.cameraImg = SVC_URL.baseURL + imgName;
      $scope.notifications = (_notify && _notify.permission) ? true : false;
      $scope.notificationsAllowed = (_notify && _notify.permission === "granted") ? true : false;
      $scope.activeNotifications = true;
      $scope.companies = $rootScope.companies;

      /* User data */
      $scope.userNamePattern = new RegExp("^([a-zA-Z0-9\\-\\_\\+]{3,})$");
      $scope.user = false;
      $scope.Hash = Parse.Object.extend("Token");
      $scope.query = new Parse.Query($scope.Hash);
      $scope.clientId = $rootScope.clientId;

      /* Door data  */
      $scope.open = false;
      $scope.maxTime = 3000;

      /* Countdown data*/
      $scope.currentTime = $scope.maxTime;
      $scope.countdown = {
        color: colorClosed,
        bgColor: '#eaeaea',
        radius: '55',
        stroke: '5',
        semi: false,
        rounded: true,
        clockwise: false,
        responsive: false,
        duration: 100,
        animation: 'easeInOutQuart',
        animationDelay: 0
      };

      /* Console */
      $scope.console = {};

      /* Fixed */
      $scope.console.fixed = true;

      /* Custom prefix */
      $scope.console.customPrefix = "OfficeDoors DoorBell";

      /* Custom commands */
      $scope.console.customCommands = {
        cameraFix: {
          name: "camera",
          description: "Some actions related with camera capture.",
          params: [
            {
              name: "reset",
              description: "Reset camera capture proccess."
            }
          ],
          action: function(printLn, params){
            if(params){
              if(params.reset){
                printLn("Request was sent.");

                maintenanceServices.cameraFix().then(function(response){
                  printLn("Camera <b><span style=\'color: green;\'>fixed</span></b>.");
                })
                .error(function(status, data, headers, config){
                  printLn("There was an <b><span style=\'color: red;\'>error</span></b> while fixing the camera.")
                });
              }
            }
          }
        },
        screenshot: {
          name: "screenshot",
          description: "Download a camera screenshot.",
          params: false,
          action: function(printLn, params){
            window.open(SVC_URL.baseURL + imgName);
          }
        },
        serverStatus: {
          name: "server",
          description: "Some actions related to the server.",
          params: [
            {
              name: "status",
              description: "Ping backend service and verify if it's online."
            }
          ],
          action: function(printLn, params){
            if(params){
              if(params.status){
                services.talk().success(function(response){

                  printLn("Server is <b><span style='color: green'>online</span></b>.");

                }).error(function(){

                  printLn("Server is <b><span style='color: red'>offline</span></b>.");
                });
              }
            }
          }
        }
      };

      /* Functions */
      $scope.imageRefresher();
      $scope.getStoredData();
      $scope.requestNotifications();
    };

    /* Get stored data */
    $scope.getStoredData = function(){

      /* If there are saved data */
      if(localStorageService.get('userId')){
        $scope.user = {
          image: localStorageService.get('image'),
          email: localStorageService.get('email'),
          name: localStorageService.get('name'),
          userId: localStorageService.get('userId'),
          alias: localStorageService.get('alias'),
          validated: localStorageService.get('validated')
        };

        $scope.activeNotifications = (localStorageService.get('notifications') === false) ? false : true;
        localStorageService.set('notifications', $scope.activeNotifications);

        if(dev){ $scope.$apply(); }
      }
    };

    /* Get native notification permission */
    $scope.requestNotifications = function(){
      var newImage = new Image();
      newImage.url = "icons/favicon.png";

      _notify.requestPermission(function(response){
        if(response === "granted"){
          $notificationsAllowed = true;
          if(dev){ $scope.$apply(); }
        }
      });
    };

    /* Set a new Alias for the user */
    $scope.newAlias = function(){

      /* Open modal */
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'scripts/views/newAlias.html',
        controller: 'newAlias',
        resolve: {
          alias: function () {
            return $scope.user.alias;
          },
          userNamePattern: function(){
            return $scope.userNamePattern;
          }
        }
      });

      /* Save */
      modalInstance.result.then(function (newAlias) {
        $scope.user.alias = newAlias;
        localStorageService.set('alias', $scope.user.alias);

        var data = {
          alias: $scope.user.alias
        };
        services.saveAlias(data).success(function(response){
          services.notify("Tu nuevo alias se guardó con éxito.", localStorageService.get('notifications'));
        })
        .error(function(status, data, headers, response){
          services.notifyError("Hubo un problema al guardar tu alias.", localStorageService.get('notifications'));
        });

      /* Cancel */
      }, function () {

      });
    };

    /* Logout the user */
    $scope.logout = function(){

      /* Logout from Google */
      gapi.auth.signOut();

      /* Remove local storage */
      localStorageService.remove('image');
      localStorageService.remove('email');
      localStorageService.remove('name');
      localStorageService.remove('userId');
      localStorageService.remove('alias');
      localStorageService.remove('validated');

      /* Remove the user from the controller */
      $scope.user = false;
    };

    /* Button clicked */
    $scope.openDoors = function(openToMySelf){

      /* If it's closed */
      if(!$scope.open){

        /* If backend is enabled */
        if($scope.enabled){
          var params = {
            token: $scope.user.userId
          };

          if(openToMySelf){
            params.texto = localStorageService.get('alias');
          }

          services.openDoors(params).success(function(response){

            if(response == "busy"){

              services.notifyError("La puerta ya estaba abierta.", localStorageService.get('notifications'));
            }
            else if(response == false){

              services.notifyError("Por favor, inicia sesión para abrir la puerta.", localStorageService.get('notifications'));
            }
            else{

              /* On success, open door animation */
              $scope.openDoor();
            }
          })
          .error(function(status, data, headers, config){
            services.notifyError('Hubo un problema de conexión', localStorageService.get('notifications'));
          });
        }

        /* If no backend enabled, simulate open animation */
        else{
          $scope.openDoor();
        }
      }
    };

    /* Some settings */
    $scope.openDoor = function(){

      /* Set doors as open */
      $scope.open = true;

      /* Set initial count */
      $scope.countdown.color = colorOpen;

      /* Stores the animation starts */
      animationStart = new Date().getTime();
      lastCheck = new Date().getTime();

      /* Execute the countdown */
      $scope.timming();
    };

    /* Start the countdown */
    $scope.timming = function(){
      console.log("Before "+ $scope.currentTime);

      if((new Date().getTime() - lastCheck) > (imgRefreshTime + 1)){
        $scope.currentTime = $scope.currentTime - (new Date().getTime() - animationStart);
        console.log("After "+ $scope.currentTime);
      }

      lastCheck = new Date().getTime();

      $timeout(function(){

        /* Reduce time 100ms */
        $scope.currentTime = $scope.currentTime - 15;

        /* If time is not 0 */
        if($scope.currentTime > 0){
          $scope.timming();
        }

        /* If time is lower than 0 */
        else{
          $scope.currentTime = 0;

          $timeout(function () {
            $scope.open = false;
            $scope.currentTime = $scope.maxTime;
            $scope.countdown.color = colorClosed;
          }, 15);
        }
      }, 15);
    };

    /* Announce the food arrival in Slack */
    $scope.foodArrived = function(company){
      var data = {
        empresa: company
      };

      services.announceFood(data).success(function(){
        // services.notify("Enviado a Slack", localStorageService.get('notifications'));
      })
      .error(function(status, data, headers, config){
        services.notifyError("No se pudo enviar a Slack", localStorageService.get('notifications'));
      });
    }

    /* Refresh camera image */
    $scope.imageRefresher = function(){

      /* Only enable refresher on tablet+ */
      if( !$scope.isMobile ){

        /* Update camera image */
        var cacheAvoider = new Date().getTime();
        $scope.cameraImg = SVC_URL.baseURL + imgName + "?t=" + cacheAvoider;

        $timeout(function () {
          $scope.imageRefresher();
        }, imgRefreshTime);
      }

    };

    /* Update notification config */
    $scope.updateNotificationConfig = function(param){
      clearTimeout( notifTimeout );
      notifTimeout = setTimeout(function(){
        localStorageService.set('notifications', param.activeNotifications);
      }, 500);
    };

    /* If google auth works */
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {

      /* If there are saved data */
      if(localStorageService.get('userId')){
        $scope.getStoredData();
      }

      /* If there is no user logged in */
      else{

        /* Load Google+ API */
        gapi.client.load('plus', 'v1', function(){

          /* Get my info from Google*/
          var data = {
            userId: 'me'
          }
          gapi.client.plus.people.get(data).execute(function(response){

            /* Parse data */
            var data = {
              image: response.image.url,
              email: '',
              name: response.displayName,
              userId: response.id
            };

            /* Get the email */
            if(response.emails){
              for(var x in response.emails){
                if(response.emails[x].type == "account"){
                  data.email = response.emails[x].value;
                  break;
                }
              }
            }

            /* Save user data */
            $scope.user = data;
            $scope.user.alias = $scope.user.name.substring(0, $scope.user.name.indexOf(" "));

            /* Login on app's backend */
            if($scope.enabled){
              services.login(data).success(function(response){
                if(response != false && response != "false"){
                  $scope.user.validated = true;

                  localStorageService.set('image', $scope.user.image);
                  localStorageService.set('email', $scope.user.email);
                  localStorageService.set('name', $scope.user.name);
                  localStorageService.set('userId', $scope.user.userId);
                  localStorageService.set('alias', $scope.user.alias);
                  localStorageService.set('validated', $scope.user.validated);

                  if(dev){ $scope.$apply(); }
                }
                else{
                  services.notifyError("Tu cuenta no está habilitada", localStorageService.get('notifications'));
                  $scope.user = false;
                  $scope.logout();
                }
              })

              /* Error on login */
              .error(function(status, data, headers, config){
                services.notifyError("Tu cuenta no está habilitada", localStorageService.get('notifications'));
                $scope.user = false;
                $scope.logout();
              });
            }
            else{
              $scope.user.validated = true;

              if(dev){ $scope.$apply(); }
            }
          });
        });
      }
    });

    /* If google auth fails */
    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
      // console.log("There was an error");
      // console.log(authResult);
    });

    /* Pusher event, someone is opening the door */
    $rootScope.channel.bind('estado_puerta', function(response) {
      if($scope.user && $scope.user.validated == true && response && response.message === true){

        /* If there is user data */
        if(response.token && response.token != $scope.user.userId){

          if(response.selfOpen === true){
            services.notify(response.usuario +" entró a la oficina.", localStorageService.get('notifications'));
          }
          else{
            services.notify(response.usuario +" abrió la puerta.", localStorageService.get('notifications'));
          }
        }

        $scope.openDoor();
      }
    });

    $scope.init();
  }
]);
