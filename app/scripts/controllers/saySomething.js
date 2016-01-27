officeDoors.controller('saySomething',
  ['$scope', '$uibModalInstance',
  function ($scope, $uibModalInstance) {

    $scope.init = function(){
      $("input[autofocus]").focus();
    }

    $scope.talk = function(){
      var form = $scope.saySomething;

      if(form.$valid){
        $uibModalInstance.close(form.text.$modelValue);
      }
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
}]);
