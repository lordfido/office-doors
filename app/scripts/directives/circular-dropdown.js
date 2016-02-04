officeDoors.directive('circularDropdown',
  ['$rootScope',
  function($rootScope) {
    return {
      restrict: 'AE',
      transclude: true,
      templateUrl: '/scripts/views/partials/circular-dropdown.html',
      scope: {
        options: '=',
        open: '=',
        onSelect: '='
      },
      link: function(scope, element, attrs){

        scope.init = function(){

        };

        /* Mark an option as selected */
        scope.select = function(elem){
          scope.toggle();
          scope.onSelect(elem);
        };

        /* Open/close options menu */
        scope.toggle = function(){
          scope.open = !scope.open;
        };

        scope.init();
      }
    }
}]);
