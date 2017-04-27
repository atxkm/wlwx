/**
 * 顶部信息
 * @author TaNg
 * @date   2016-03-07T15:35:09+0800
 */
define(['./directive'], function(directive) {
  'use strict';

  directive.directive('appHeader', [
    '$view', '$session', '$http', '$location',
    function($view, $session, $http, $location) {
      return {
        restrict: 'E',
        templateUrl: 'html/template/app-header.html',
        replace: true,
        link: function($scope, element, attr) {
          $scope.showMsg = false;

          $http({
            url: '/wlwx/loginUser',
            method: 'GET'
          }).success(function(response) {

            $scope.username = response.data.username;
            $session.setItem('loginUser', response.data);
          }).error(function() {
            $location.path("/");
          });

          $scope.view = $view;

          $scope.logout = function() {

            $http({
              url: '/wlwx/logout',
              method: 'GET'
            }).success(function(response) {
              $session.clear();
              $location.path("/");
            });
          };

          $scope.redirectToReport = function() {
            $location.path("/overview");
          };

          $scope.redirectToSetting = function() {
            $location.path("/account");
          };

          $scope.messageContent = '';
          $scope.messageEmail = '';

          $scope.submitMessage = function() {

            if ($scope.messageContent === '') {
              return;
            }

            $http({
              url: '/wlwx/feedback/save',
              method: 'POST',
              params: {
                content: $scope.messageContent,
                email: $scope.messageEmail
              }
            }).success(function(response) {

              alert('提交成功');
              $scope.showMsg = false;
              $scope.messageContent = '';
              $scope.messageEmail = '';
            });
          };
        }
      };
    }
  ]);
});
