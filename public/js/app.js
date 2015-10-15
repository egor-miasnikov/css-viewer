var app = angular.module('ParseCssApp', ['ParseCssService']);

app.controller('AppCtrl', function($scope, getCss) {
    $scope.oneAtATime = true;
    $scope.siteUrl = '';
    $scope.isLoading = false;
    $scope.showingStyle = null;
    $scope.css = [];
    $scope.showContent = function(style) {
        if ($scope.showingStyle === style) {
            $scope.showingStyle = null;
        }else {
            $scope.showingStyle = style;
        }

    };
    $scope.submit = function() {
        $scope.css = [];
        $scope.isLoading = true;
        $scope.css = getCss.query({
            siteUrl: $scope.siteUrl
        });
        $scope.siteUrl = '';
    };
    $scope.selectStyle = function(style) {
        $scope.selected = style;
    };
})
.directive('loader', function() {
    return {
            restrict: 'E',
            replace: true,
            templateUrl: 'template/loader.html',
            controller: 'AppCtrl',
            scope: {}
        };
})
.directive('styleList', function() {
    return {
            restrict: 'E',
            replace: true,
            templateUrl: 'template/list.html',
            controller: 'AppCtrl',
            scope: {
                styles: '='
            },
            link: function(scope) {
                console.log(scope.styles);
            }
        };
});
