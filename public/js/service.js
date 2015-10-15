angular.module('ParseCssService', ['ngResource'])
    .factory('getCss', function($resource) {
        var url = 'https://murmuring-harbor.herokuapp.com/api/css?siteUrl=:siteUrl';

        var resource = $resource(url, {'siteUrl': '@siteUrl'}, {
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function(data) {
                    var r = angular.fromJson(data);
                    return r.response[0];
                },
            }
        });

        return {
            query: function() {
                return resource.query.apply(this, arguments);
            }
        };
    });
