angular.module('datepickerAlApp', []).
controller('datepickerCtrl', [
  '$scope', '$document',
  function($scope, $document) {
    $scope.selectDate = null; //选择的日期
    $scope.showDate = null; // 用来显示的日期
    $scope.showDatePicker = false; //日历显示变量
    $scope.callback = null; //日历上绑定的事件
    $scope.calendarType = 'day'; //选择日/月份/年份
    $scope.updateCalendarDay = null; //更新日期选择界面(td)
    $scope.updateCalendarMonth = null; //更新月选择界面(td)
    $scope.updateCalendarYear = null; //更新年选择界面(td)
    $scope.bindData = null; //绑定的值
    $scope.judgePosition = null; //判断日历位置
    //显示/隐藏日历
    $scope.showOrHide = function() {
      $scope.calendarType = 'day';

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
      if ($scope.calendarType == 'day') {
        $scope.calendarValue = showDate.getFullYear() + '年' + (showDate.getMonth() + 1) + '月';
        $scope.updateCalendarDay();

      } else if ($scope.calendarType == 'month') {
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

      $scope.calendarType = 'day';
      $scope.updateCalendar();

      $scope.calendarValue = $scope.showDate.getFullYear() + '年' + ($scope.showDate.getMonth() + 1) + '月';
    };
    //选择年份
    $scope.pickYear = function(year) {
      $scope.showDate.setFullYear(year);
      $scope.calendarType = 'month';
      $scope.updateCalendar();
    };
  }
]).
directive('datepickerAl', function() {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    template: '<div class="datepicker-al" ng-controller="datepickerCtrl" ng-click="$event.stopPropagation()"><div ng-transclude ng-click="showOrHide()"></div><calendar-al ng-show="showDatePicker"></calendar-al></div>',
    link: function(scope, element, attr) {
      scope.callback = scope[attr['callback']];
    }
  };
}).
directive('datepickerAlValue', function() {
  //显示所选日期值
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      var scope = scope.$parent;

      if (scope[attr['ngModel']]) {
        var date = scope[attr['ngModel']].replace(/年|月/g, '-').replace(/日/, '').split('-');
        scope.selectDate = new Date(date[0], date[1] - 1, date[2]);
      }

      scope.pickDate = function(day) {
        var showDate = scope.showDate,
          selectDate = scope.selectDate;

        selectDate.setYear(showDate.getFullYear());
        selectDate.setMonth(showDate.getMonth());
        selectDate.setDate(day);
        scope.updateCalendar();
        scope.showOrHide();

        //调用获取数据的方法
        scope.$parent[attr['ngModel']] = selectDate.getFullYear() + '年' + (selectDate.getMonth() + 1) + '月' + selectDate.getDate() + '日';

        if (scope.callback) {
          scope.callback()
        }
      };
    }
  };
}).
directive('calendarAl', function() {
  //整个日历控件
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="calendar-al"><calendar-title></calendar-title><calendar-body></calendar-body></div>',
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
directive('calendarTitle', function() {
  //日历顶部份
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-t"><calendar-left></calendar-left><calendar-right></calendar-right><calendar-value></calendar-value></div>'
  };
}).
directive('calendarLeft', function() {
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
directive('calendarRight', function() {
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
directive('calendarValue', function() {
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
directive('calendarBody', function() {
  //日历日期部分
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-b"><calendar-day ng-show="calendarType==\'day\'"></calendar-day><calendar-month ng-show="calendarType==\'month\'"></calendar-month><calendar-year ng-show="calendarType==\'year\'"></calendar-year></div>'
  };
}).
directive('calendarDay', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="al-day"><ul class="al-d-t"><li>周日</li><li>周一</li><li>周二</li><li>周三</li><li>周四</li><li>周五</li><li>周六</li></ul><calendar-day-body></calendar-day-body></div>'
  };
}).
directive('calendarDayBody', [
  '$compile',
  function($compile) {
    return {
      restrict: 'E',
      replace: true,
      template: '<table class="al-d-b"></table>',
      link: function(scope, element, attr) {
        scope.updateCalendarDay = function() {
          //生成日历中的日期(td)
          var today = new Date(),
            showDate = scope.showDate,
            selectDate = scope.selectDate,
            dayObj = [],
            dom = '',
            dayNum = new Date(showDate.getFullYear(), showDate.getMonth() + 1, 0).getDate(),
            firstWeek = new Date(new Date(showDate.getTime()).setDate(1)).getDay(),
            lastMonthDayNum = new Date(showDate.getFullYear(), showDate.getMonth() + 1, 0).getDate(),
            dayIndex = -firstWeek;

          for (var i = 0, iLen = 6; i < iLen; i++) {
            dom += '<tr>';

            for (var j = 0, jLen = 7; j < jLen; j++) {

              if (dayIndex++ < 0) {
                dom += '<td class="unable">' + (lastMonthDayNum + dayIndex + 1) + '</td>';

              } else if (dayIndex > dayNum) {
                dom += '<td class="unable">' + (dayIndex - dayNum) + '</td>';

              } else {

                var className = 'able',
                  imgDom = '',
                  bindEvent = 'ng-click="pickDate(' + dayIndex + ')"';

                if (showDate.getFullYear() == selectDate.getFullYear() && showDate.getMonth() == selectDate.getMonth() && dayIndex == selectDate.getDate()) {
                  className += ' active';
                }

                if (showDate.getFullYear() == today.getFullYear() && showDate.getMonth() == today.getMonth()) {

                  if (dayIndex == today.getDate()) {
                    imgDom = '<img src="img/today.png" class="today">';
                    className = 'unable';
                    bindEvent = '';

                  } else if (dayIndex > today.getDate()) {
                    className = 'unable';
                    bindEvent = '';
                  }
                }

                if (showDate.getFullYear() == today.getFullYear() && showDate.getMonth() > today.getMonth() || showDate.getFullYear() > today.getFullYear()) {
                  className = 'unable';
                  bindEvent = '';
                }

                dom += '<td class="' + className + '" ' + bindEvent + '>' + imgDom + dayIndex + '</td>';
              }
            }

            dom += '</tr>';
          }
          dom = $compile(dom)(scope);
          element.html('');
          element.append(dom);
        };
      }
    };
  }
]).
directive('calendarMonth', [
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
directive('calendarYear', [
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
        };
      }
    };
  }
]);
