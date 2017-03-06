/**
 * Created by root on 8/24/15.
 */
terminKalender.config(function($routeProvider){
    $routeProvider.when('/login',{
        controller:"loginCtrl",
        templateUrl:"./parts/tkLogin.html"
    });
    $routeProvider.when('/group/:id',{
        controller:"groupCtrl",
        templateUrl:"./parts/tkGroup.html"
    });
    $routeProvider.when('/user/:id',{
        controller:"userCtrl",
        templateUrl:"./parts/tkUser.html"
    });
    $routeProvider.otherwise('/login');
});