officeDoors.controller('mainController',
  ['$scope', '$rootScope', '$timeout', 'services', 'Notification', '$uibModal', 'localStorageService',
  function ($scope, $rootScope, $timeout, services, Notification, $uibModal, localStorageService) {

    var colorClosed = '#d9534f';
    var colorOpen = '#5cb85c';
    var imgName = 'cam.jpg';
    var imgRefreshTime = 150;

    $scope.init = function(){
      $scope.loaded = true;
      $scope.isMobile = true;

      $scope.enabled = $rootScope.enabled;
      $scope.cameraImg = SVC_URL.baseURL + imgName;

      $scope.userNamePattern = new RegExp("^([a-zA-Z0-9\\-\\_\\+]{3,})$");
      $scope.user = false;
      $scope.Hash = Parse.Object.extend("Token");
      $scope.query = new Parse.Query($scope.Hash);
      $scope.clientId = $rootScope.clientId;

      $scope.open = false;
      $scope.maxTime = 3000;

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

      $scope.imageRefresher();
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
            params.texto = localStorageService.get('alias')
          }

          services.openDoors(params).success(function(response){

            if(response != false && response != "false"){

              /* On success, open door animation */
              $scope.openDoor();
            }
            else{
              Notification.error("Por favor, inicia sesión para abrir la puerta.");
            }
          })
          .error(function(status, data, headers, config){
            Notification.error('Hubo un problema de conexión');
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

      /* Execute the countdown */
      $scope.timming();
    };

    /* Start the countdown */
    $scope.timming = function(){

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

      /* Cancel */
      }, function () {

      });
    };

    /* Logout the user */
    $scope.logout = function(){
      gapi.auth.signOut();
      $scope.user = false;
    };

    /* Refresh camera image */
    $scope.imageRefresher = function(){

      $scope.isMobile = services.isMobile();

      /* Only enable refresher on tablet+ */
      if( $scope.isMobile ){

        /* Update refresh time */
        if(imgRefreshTime < 3000){
          imgRefreshTime = 3000;
        }

      }
      else{

        /* Update refresh time */
        if(imgRefreshTime >= 3000){
          imgRefreshTime = 150;
        }

        /* Update camera image */
        var cacheAvoider = new Date().getTime();
        $scope.cameraImg = SVC_URL.baseURL + imgName + "?t=" + cacheAvoider;
      }

      $timeout(function () {
        $scope.imageRefresher();
      }, imgRefreshTime);
    };

    /* If google auth works */
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {

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
              if(response.emails[0].type == "account"){
                data.email = response.emails[x].value;
                break;
              }
            }
          }

          /* Save user data */
          $scope.user = data;

          /* Create an alias, if there isn't */
          if(localStorageService.get('alias')){
            $scope.user.alias = localStorageService.get('alias');
          }
          else{
            $scope.user.alias = $scope.user.name.substring(0, $scope.user.name.indexOf(" "));
            localStorageService.set('alias', $scope.user.alias);
          }

          /* Login on app's backend */
          if($scope.enabled){
            services.login(data).success(function(response){
              if(response != false && response != "false"){
                $scope.user.validated = true;
              }
            })

            /* Error on login */
            .error(function(status, data, headers, config){
              Notification.error("Tu cuenta no está habilitada");
              $scope.user = false;
              $scope.logout();
            });
          }
          else{
            $scope.user.validated = true;
          }
        });
      });
    });

    /* If google auth fails */
    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
      // console.log("There was an error");
      // console.log(authResult);
    });

    $scope.init();
  }
]);
