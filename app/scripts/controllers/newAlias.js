officeDoors.controller('newAlias',
  ['$scope', '$uibModalInstance', 'alias', 'userNamePattern',
  function ($scope, $uibModalInstance, alias, userNamePattern) {

    $scope.alias = alias;
    $scope.userNamePattern = userNamePattern;

    $scope.save = function(){
      var form = $scope.newAlias;

      if(form.$valid){
        $uibModalInstance.close(form.alias.$modelValue);
      }
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);
