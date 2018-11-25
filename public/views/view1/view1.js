'use strict';

var app = angular.module('myApp.view1', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'views/view1/view1.html',
    controller: 'View1Ctrl'
  });
}]);

app.controller('View1Ctrl', ['$scope','$location',function($scope,$location) {

   	$('body').addClass('enterscreen');

	$scope.redirect_design = function (control) {
		if (control == 1) {
			$location.path( "/design" );
		}else{
			$location.path( "/upload" );
		}
	}

}]);

