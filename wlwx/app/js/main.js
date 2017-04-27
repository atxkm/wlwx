require.config({
  paths: {
    'angular': '../bower_components/angular/angular.min',
    'angular-route': '../bower_components/angular-route/angular-route.min',
    'angular-cookies': '../bower_components/angular-cookies/angular-cookies.min',
    'echarts': '../bower_components/echarts/dist/echarts.min',
    'datepickerAlApp': '../lib/datepicker-al-app',
    'datepickerAlApp2': '../lib/datepicker-al-app2',
    'datepickerAlApp3': '../lib/datepicker-al-app3',
    'heatmap': '../lib/heatmap'
  },
  shim: {
    'angular-route': ['angular'],
    'angular-cookies': ['angular'],
    'datepickerAlApp': ['angular'],
    'datepickerAlApp2': ['angular'],
    'datepickerAlApp3': ['angular']
  }
});

require(['./app'], function() {
  angular.bootstrap(document, ['app']);
});
