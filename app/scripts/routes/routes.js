officeDoors.config(
  ['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
  	$stateProvider

  		.state('main', {
  			url: '/',
  			views: {
  				'header': {
  				  templateUrl: '/scripts/views/header.html',
  				  controller: 'headerController'
  				},
  				'nav': {
  				  templateUrl: '/scripts/views/nav.html',
  				  controller: 'navController'
  				},
          'footer': {
  				  templateUrl: '/scripts/views/footer.html',
  				  controller: 'footerController'
  				},
  				'content@': {
  				  templateUrl: '/scripts/views/main.html',
  				  controller: 'mainController'
  				}
  			}
  		});

    $urlRouterProvider
      .otherwise('/');
}]);
