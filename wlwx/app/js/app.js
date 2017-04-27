define([
  'angular',
  'angular-route',
  'angular-cookies',
  'datepickerAlApp',
  'datepickerAlApp2',
  'datepickerAlApp3',
  './controller/main',
  './directive/main',
  './service/main',
], function() {
  'use strict';

  var app = angular.module('app', [
    'ngRoute',
    'ngCookies',
    'controller',
    'directive',
    'service',
    'datepickerAlApp',
    'datepickerAlApp2',
    'datepickerAlApp3'
  ]);

  app.config([
    '$routeProvider', '$locationProvider', '$httpProvider', "$compileProvider",
    function($routeProvider, $locationProvider, $httpProvider, $compileProvider) {
      //IE中有ajax缓存。。。
      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }
      // Enables Request.IsAjaxRequest() in ASP.NET MVC
      $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
      // Disable IE ajax request caching
      $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
      $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

      // 统一处理response返回码
      $httpProvider.interceptors.push('responseInterceptor');

      //网站路由
      $routeProvider.when("/", { //登录页，作为首页
        redirectTo: "/login"
      }).
      when("/login", { //登录页
        templateUrl: "html/login.html",
        controller: "LoginCtrl"
      }).
      when("/overview", { //概览页
        templateUrl: "html/overview.html",
        controller: "OverviewCtrl",
        authenticate: true
      }).
      when('/realtime', {
        templateUrl: 'html/realtime.html',
        controller: 'RealtimeCtrl',
        authenticate: true
      }).
      when('/enter-trend', {
        templateUrl: 'html/enter-trend.html',
        controller: 'EnterTrendCtrl',
        authenticate: true
      }).
      when('/passenger-trend', {
        templateUrl: 'html/passenger-trend.html',
        controller: 'PassengerTrend',
        authenticate: true
      }).
      when('/customer-type', {
        templateUrl: 'html/customer-type.html',
        controller: 'CustomerTypeCtrl',
        authenticate: true
      }).
      when('/dwelltime', {
        templateUrl: 'html/dwelltime.html',
        controller: 'DwelltimeCtrl',
        authenticate: true
      }).
      when('/visit-cycle', {
        templateUrl: 'html/visit-cycle.html',
        controller: 'VisitCycleCtrl',
        authenticate: true
      }).
      when('/visit-times', {
        templateUrl: 'html/visit-times.html',
        controller: 'VisitTimesCtrl',
        authenticate: true
      }).
      when('/liveness', {
        templateUrl: 'html/liveness.html',
        controller: 'LivenessCtrl',
        authenticate: true
      }).
      when('/phone-type', {
        templateUrl: 'html/phone-type.html',
        controller: 'PhoneTypeCtrl',
        authenticate: true
      }).
      when('/heatmap', {
        templateUrl: 'html/heatmap.html',
        controller: 'HeatmapCtrl',
        authenticate: true
      }).
      when('/account', {
        templateUrl: 'html/account.html',
        controller: 'AccountCtrl',
        authenticate: true
      }).
      when('/store', {
        templateUrl: 'html/store.html',
        controller: 'StoreCtrl',
        authenticate: true
      }).
      when('/filter', {
        templateUrl: 'html/filter.html',
        controller: 'FilterCtrl',
        authenticate: true
      }).
      when('/device', {
        templateUrl: 'html/device.html',
        controller: 'DeviceCtrl',
        authenticate: true
      }).
      when('/help', {
        templateUrl: 'html/help.html',
        authenticate: true
      }).
      when("/404", { //概览页
        templateUrl: "html/404.html"
      }).
      otherwise({
        redirectTo: "/404"
      });

      $locationProvider.html5Mode(true);

      //防止ng-href出现unsafe
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
    }
  ]);

  // 权限判断
  app.run([
    '$rootScope', '$location', '$session',
    function($rootScope, $location, $session) {

      $rootScope.$on('$routeChangeStart', function(event, next) {

        if (next.authenticate && JSON.stringify($session.getItem('loginUser')) == '{}') {
          $location.path('/');
        }
      });
    }
  ]);

  return app;
});
