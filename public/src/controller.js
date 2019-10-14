angular.module('ContactsApp')
    .controller('ListController', function($scope, $rootScope, Contact, $location, options){
        $rootScope.PAGE ="all";
        $scope.contacts = Contact.query();
        $scope.fields = ['firstName', 'lastName'].concat(options.displayed_fields);

        $scope.sort = function ( field ) {
          $scope.sort.field = field;
            $scope.sort.order = !$scope.sort.order;
        };

        $scope.sort.field = 'firstName';
        $scope.sort.order = false;

        $scope.show = function(id) {
            $location.url("/contact/" + id);
        };
    })
    .controller('NewController', function($scope, $rootScope,Contact, $location){
        $rootScope.PAGE ="new";
        $scope.contact = new Contact({
            firstName:['','text'],
            lastName:['','text'],
            email:['','email'],
            homePhone:['','tel'],
            mobilePhone:['','tel'],
            birthday:['','date'],
            website:['','url'],
            address:['','text'],
            options:{}
        });
        $scope.save = function(){
          if($scope.newContact.$invalid){
              $scope.$broadcast('record:invalid');
          }else{
              $scope.contact.$save();
              $location.url('/contacts');
          }
        };
    })
    .controller('SingleController', function($scope, $location, $rootScope,Contact, $routeParams){
        $rootScope.PAGE ="single";
        $scope.contact = Contact.get({id:parseInt($routeParams.id, 10)});
        $scope.delete = function () {
            $scope.contact.$delete();
            $location.url('/contact');
        }
    })
    .controller('SettingsController', function($scope, $rootScope, options, Fields){
        $rootScope.PAGE = "settings";

        $scope.allFields = [];
        $scope.fields = options.displayed_fields;

        Fields.headers().then(function(data){
           $scope.allFields = data;
        });
        $scope.toggle = function (field) {
            console.log("Options");
            console.log(options);
            console.log("Field");
            console.log(field);
            if (!angular.isDefined(options.displayed_fields)) {
                options.displayed_fields.push(field);
            } else {
                var i = options.displayed_fields.indexOf(field);
                if (i > -1) options.displayed_fields.splice(i, 1); else options.displayed_fields.push(field);
            }
            console.log("Options");
            console.log(options);
            Fields.set(options.displayed_fields);
        };
    })
;