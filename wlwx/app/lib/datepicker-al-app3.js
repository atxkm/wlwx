angular.module('datepickerAlApp3', []).
controller('datepickerCtrl3', [
  '$scope', '$document',
  function($scope, $document) {
    $scope.selectDate = new Date(); //选择的日期
    $scope.showDate = null; // 用来显示的日期
    $scope.showDatePicker = false; //日历显示变量
    $scope.callback = null; //日历上绑定的事件
    $scope.calendarType = ''; //选择月份/年份
    $scope.updateCalendarDay = null; //更新日期选择界面(td)
    $scope.updateCalendarQuarter = null; //更新月选择界面(td)
    $scope.updateCalendarYear = null; //更新年选择界面(td)
    $scope.bindData = null; //绑定的值
    $scope.judgePosition = null; //判断日历位置
    $scope.selectQuarter = null; //判断日历位置
    //显示/隐藏日历
    $scope.showOrHide = function() {
      $scope.calendarType = 'quarter';

      if ($scope.showDatePicker) {
        $scope.showDatePicker = false;

      } else {
        $scope.showDatePicker = true;
        $scope.showDate = new Date();
        $scope.updateCalendar();
        $scope.judgePosition();
      }
    };
    //点击其他地方隐藏日历
    $document.on('click', function(event) {
      $scope.showDatePicker = false;
      $scope.$apply();
    });
    //更新日历
    $scope.updateCalendar = function() {
      var showDate = $scope.showDate;
      //改变顶部年月
      if ($scope.calendarType == 'quarter') {
        $scope.calendarValue = showDate.getFullYear() + '年';
        $scope.updateCalendarQuarter();

      } else {
        $scope.calendarValue = (showDate.getFullYear() - 8) + '年' + ' - ' + showDate.getFullYear() + '年';
        $scope.updateCalendarYear();
      }
    };
    //选择月份
    $scope.pickQuarter = function(quarter) {
      var showDate = $scope.showDate;
      $scope.selectQuarter = quarter;
      var month = 0;

      switch (quarter) {
        case 1:
          month = 1;
          break;
        case 2:
          month = 4;
          break;
        case 3:
          month = 7;
          break;
        case 4:
          month = 10;
      }

      $scope.showDate.setMonth(month - 1);
      $scope.selectDate = new Date($scope.showDate.getTime());
      $scope.calendarValue = $scope.showDate.getFullYear() + '年';

      if ($scope.callback) {
        $scope.$parent.type = 'quarter';
        $scope.callback($scope.showDate.getFullYear(), quarter)
      }

      $scope.showOrHide();
    };
    //选择年份
    $scope.pickYear = function(year) {
      $scope.showDate.setFullYear(year);
      $scope.calendarType = 'quarter';
      $scope.updateCalendar();
    };
  }
]).
directive('datepickerAl3', function() {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<div class="datepicker-al" ng-controller="datepickerCtrl3" ng-click="$event.stopPropagation()"><div ng-transclude ng-click="showOrHide()"></div><calendar-al3 ng-show="showDatePicker"></calendar-al3></div>',
    link: function(scope, element, attr) {
      scope.callback = scope[attr['callback']];
    }
  };
}).
directive('calendarAl3', function() {
  //整个日历控件
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="calendar-al"><calendar-title3></calendar-title3><calendar-body3></calendar-body3></div>',
    link: function(scope, element, attr) {
      scope.judgePosition = function() {
        var obj = element[0].parentElement,
          offsetLeft = obj.offsetLeft;

        while (obj.offsetParent != null) {
          obj = obj.offsetParent;
          offsetLeft += obj.offsetLeft;
        }

        if (offsetLeft + 324 - document.body.scrollLeft > document.body.offsetWidth) {
          element[0].style.left = '';
          element[0].style.right = 40 + 'px';

        } else {
          element[0].style.left = offsetLeft - document.body.scrollLeft + 'px';
        }
      }
    }
  };
}).
directive('calendarTitle3', function() {
  //日历顶部份
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-t"><calendar-left3></calendar-left3><calendar-right3></calendar-right3><calendar-value3></calendar-value3></div>'
  };
}).
directive('calendarLeft3', function() {
  //向左按钮
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-btn al-t-l">&lt;</div>',
    link: function(scope, element, attr) {
      element.on('click', function(event) {
        var calendarType = scope.calendarType,
          showDate = scope.showDate;

        if (calendarType == 'quarter') {
          showDate.setFullYear(showDate.getFullYear() - 1);

        } else {
          showDate.setFullYear(showDate.getFullYear() - 9);
        }
        scope.updateCalendar();
        scope.$apply();
      });
    }
  };
}).
directive('calendarRight3', function() {
  //向右按钮
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-btn al-t-r">&gt;</div>',
    link: function(scope, element, attr) {
      element.on('click', function(event) {
        var calendarType = scope.calendarType,
          showDate = scope.showDate;

        if (calendarType == 'quarter') {
          showDate.setFullYear(showDate.getFullYear() + 1);

        } else {
          showDate.setFullYear(showDate.getFullYear() + 9);
        }
        scope.updateCalendar();
        scope.$apply();
      });
    }
  };
}).
directive('calendarValue3', function() {
  //顶上年月
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-btn al-t-m">{{calendarValue}}</div>',
    link: function(scope, element, attr) {
      element.on('click', function() {

        if (scope.calendarType == 'quarter') {
          scope.calendarType = 'year';
        }

        scope.updateCalendar();
        scope.$apply();
      });
    }
  };
}).
directive('calendarBody3', function() {
  //日历日期部分
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-b"><calendar-month3 ng-show="calendarType==\'quarter\'"></calendar-month3><calendar-year3 ng-show="calendarType==\'year\'"></calendar-year3></div>'
  };
}).
directive('calendarMonth3', [
  '$compile',
  function($compile) {
    return {
      restrict: 'E',
      replace: true,
      template: '<table class="al-quarter"></table>',
      link: function(scope, element, attr) {
        scope.updateCalendarQuarter = function() {
          var dom = '';

          for (var i = 0; i < 2; i++) {
            dom += '<tr>';

            for (var j = 0; j < 2; j++) {
              var n = j + 1 + i * 2,
                m = n * 3 - 2,
                classAttr = '';

              if (n == scope.selectQuarter && scope.showDate.getFullYear() == scope.selectDate.getFullYear()) {
                classAttr = ' class="active" ';
              }
              dom += '<td ng-click="pickQuarter(' + n + ');"' + classAttr + '>' + n + '季度<br>(' + m + '-' + (m + 2) + '月)' +
                '</td>';
            }
            dom += '</tr>';
          }

          element.html('');
          element.append($compile(dom)(scope));
        }
      }
    };
  }
]).
directive('calendarYear3', [
  '$compile',
  function($compile) {
    return {
      restrict: 'E',
      replace: true,
      template: '<table class="al-year"></table>',
      link: function(scope, element, attr) {
        scope.updateCalendarYear = function() {
          var dom = '',
            count = -8,
            year = scope.showDate.getFullYear();

          for (var i = 0; i < 3; i++) {
            dom += '<tr>';

            for (var j = 0; j < 3; j++) {
              var y = year + count++,
                className = '';

              if (y == scope.selectDate.getFullYear()) {
                className = 'active';
              }
              dom += '<td class="' + className + '" ng-click="pickYear(' + y + ')">' + y + '年' +
                '</td>';
            }
            dom += '</tr>';
          }

          element.html('');
          element.append($compile(dom)(scope));
        }
      }
    };
  }
]);
