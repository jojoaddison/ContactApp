angular.module('ContactsApp',['ngRoute', 'ngResource', 'ngMessages'])
    .config(function ($routeProvider, $locationProvider){
	    $routeProvider
            .when('/contacts', {
                controller: 'ListController',
                templateUrl: 'views/list.html'
            })
            .when('/contact/new', {
                controller: 'NewController',
                templateUrl: 'views/new.html'
            })
            .when('/contact/:id', {
                controller: 'SingleController',
                templateUrl: 'views/single.html'
            })
            .when('/settings', {
                 controller: 'SettingsController',
                templateUrl: 'views/settings.html'
            })
            .otherwise({redirectTo: '/contacts'})
        ;

        $locationProvider.html5Mode(true);
    })
    .value('options', {})
    .run(function(options, Fields){
        console.log("app run started");
        Fields.get().success(function(data){
            console.log("Fields.get success");
            console.log(data);
            options.displayed_fields = data;
        }).error(function(err){
            console.log("Fields.get error");
        });
    })
;