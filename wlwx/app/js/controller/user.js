define(['./controller'], function(controller) {
  'use strict';

  controller.controller('UserCtrl', [
    '$scope', '$view', '$session', '$http',
    function($scope, $view, $session, $http) {
      $scope.showMsg = false;

      $http({
        url: '/wlwx/loginUser',
        method: 'GET'
      }).success(function(response) {

        $scope.username = response.data.username;
        $session.setItem('loginUser', response.data);
      }).error(function() {
        window.location.href = "/";
      });

      $scope.view = $view;

      $scope.logout = function() {
        $session.clear();

        $http({
          url: '/wlwx/logout',
          method: 'GET'
        }).success(function(response) {

          window.location.href = "/";
        });
      };

      $scope.redirectToReport = function() {
        window.location.href = '/overview';
      };

      $scope.redirectToSetting = function() {
        window.location.href = '/account';
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
  ]);
});
