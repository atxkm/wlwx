angular.module('datepickerAlApp2', []).
controller('datepickerCtrl2', [
  '$scope', '$document',
  function($scope, $document) {
    $scope.selectDate = new Date(); //选择的日期
    $scope.showDate = null; // 用来显示的日期
    $scope.showDatePicker = false; //日历显示变量
    $scope.callback = null; //日历上绑定的事件
    $scope.calendarType = ''; //选择月份/年份
    $scope.updateCalendarDay = null; //更新日期选择界面(td)
    $scope.updateCalendarMonth = null; //更新月选择界面(td)
    $scope.updateCalendarYear = null; //更新年选择界面(td)
    $scope.bindData = null; //绑定的值
    $scope.judgePosition = null; //判断日历位置
    //显示/隐藏日历
    $scope.showOrHide = function() {
      $scope.calendarType = 'month';

      if ($scope.showDatePicker) {
        $scope.showDatePicker = false;

      } else {
        $scope.showDatePicker = true;
        $scope.showDate = new Date($scope.selectDate.getTime());
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
      if ($scope.calendarType == 'month') {
        $scope.calendarValue = showDate.getFullYear() + '年';
        $scope.updateCalendarMonth();

      } else {
        $scope.calendarValue = (showDate.getFullYear() - 8) + '年' + ' - ' + showDate.getFullYear() + '年';
        $scope.updateCalendarYear();
      }
    };
    //选择月份
    $scope.pickMonth = function(month) {
      var showDate = $scope.showDate;

      if (month == 2) {
        var sepDayNum = new Date(showDate.getFullYear(), 2, 0).getDate();

        if (showDate.getDate() > sepDayNum) {
          $scope.showDate.setDate(sepDayNum);
        }
      }
      $scope.showDate.setMonth(month - 1);
      $scope.selectDate = new Date($scope.showDate.getTime());
      $scope.updateCalendar();

      if ($scope.callback) {
        $scope.$parent.type = 'month';
        $scope.callback($scope.selectDate.getFullYear(), $scope.selectDate.getMonth() + 1);
      }

      $scope.showOrHide();
    };
    //选择年份
    $scope.pickYear = function(year) {
      $scope.showDate.setFullYear(year);
      $scope.calendarType = 'month';
      $scope.updateCalendar();
    };
  }
]).
directive('datepickerAl2', [function() {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<div class="datepicker-al" ng-controller="datepickerCtrl2" ng-click="$event.stopPropagation()"><div ng-transclude ng-click="showOrHide()"></div><calendar-al2 ng-show="showDatePicker"></calendar-al2></div>',
    link: function(scope, element, attr) {
      scope.callback = scope[attr['callback']];
    }
  };
}]).
directive('calendarAl2', function() {
  //整个日历控件
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="calendar-al"><calendar-title2></calendar-title2><calendar-body2></calendar-body2></div>',
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
directive('calendarTitle2', function() {
  //日历顶部份
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-t"><calendar-left2></calendar-left2><calendar-right2></calendar-right2><calendar-value2></calendar-value2></div>'
  };
}).
directive('calendarLeft2', function() {
  //向左按钮
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-btn al-t-l">&lt;</div>',
    link: function(scope, element, attr) {
      element.on('click', function(event) {
        var calendarType = scope.calendarType,
          showDate = scope.showDate;

        if (calendarType == 'day') {
          showDate.setMonth(showDate.getMonth() - 1);

        } else if (calendarType == 'month') {
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
directive('calendarRight2', function() {
  //向右按钮
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-btn al-t-r">&gt;</div>',
    link: function(scope, element, attr) {
      element.on('click', function(event) {
        var calendarType = scope.calendarType,
          showDate = scope.showDate;

        if (calendarType == 'day') {
          showDate.setMonth(showDate.getMonth() + 1);

        } else if (calendarType == 'month') {
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
directive('calendarValue2', function() {
  //顶上年月
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-btn al-t-m">{{calendarValue}}</div>',
    link: function(scope, element, attr) {
      element.on('click', function() {

        if (scope.calendarType == 'day') {
          scope.calendarType = 'month';

        } else if (scope.calendarType == 'month') {
          scope.calendarType = 'year';
        }

        scope.updateCalendar();
        scope.$apply();
      });
    }
  };
}).
directive('calendarBody2', function() {
  //日历日期部分
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-b"><calendar-month2 ng-show="calendarType==\'month\'"></calendar-month2><calendar-year2 ng-show="calendarType==\'year\'"></calendar-year2></div>'
  };
}).
directive('calendarMonth2', [
  '$compile',
  function($compile) {
    return {
      restrict: 'E',
      replace: true,
      template: '<table class="al-month"></table>',
      link: function(scope, element, attr) {
        scope.updateCalendarMonth = function() {
          var dom = '';

          for (var i = 0; i < 3; i++) {
            dom += '<tr>';

            for (var j = 0; j < 4; j++) {
              var m = j + 1 + i * 4,
                classAttr = '';

              if (m == scope.selectDate.getMonth() + 1 && scope.showDate.getFullYear() == scope.selectDate.getFullYear()) {
                classAttr = ' class="active" ';
              }
              dom += '<td ng-click="pickMonth(' + m + ');"' + classAttr + '>' + m + '月' +
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
directive('calendarYear2', [
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
