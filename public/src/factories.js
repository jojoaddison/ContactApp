angular.module('ContactsApp')
    .factory('Contact', function($resource){
       return  $resource('/api/contact/:id', { id:'@id' }, {
            'update' : { method : 'PUT'}
       });
    })
    .factory('Fields', function($q, $http, Contact){
        var url = '/options/displayed_fields',
            ignore = ['firstName', 'lastName', 'id', 'userId'],
            allFields = [];
        var deferred = $q.defer();
        var contacts;
        contacts = Contact.query(function () {
            delete contacts.$promise;
            delete contacts.$resolved;
            //  console.log(contacts);
            contacts.forEach(function (c) {
                //   console.log(c);
                Object.keys(c).forEach(function (k) {
                    if (allFields.indexOf(k) < 0 && ignore.indexOf(k) < 0) {
                        // console.log(k);
                        allFields.push(k);
                    }
                });
            });
        });

        deferred.resolve(allFields);

        return {
            get: function(){
                return $http(url);
            },
            set: function(newFields){
                console.log(newFields)
                console.log(url);
                return $http.post(url, { fields: newFields });
            },
            headers: function(){
                return deferred.promise;
            }
        }
    })
;