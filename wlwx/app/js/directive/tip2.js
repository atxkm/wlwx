define(['./directive'], function(directive) {
  'use strict';

  directive.directive('tip2', [
    '$offset',
    function($offset) {
      return {
        restrict: 'E',
        replace: true,
        template: '<img src="img/help2.png" style="width: 15px;cursor: pointer;vertical-align: middle;">',
        link: function(scope, element, attr) {
          var div = document.createElement('div');
          div.innerHTML = '<span>' + attr.content + '</span>';
          div.className = 'tip_w';
          document.body.appendChild(div);

          var top = 0,
            left = 0;
          element.on('mouseenter', function() {
            top = $offset(element[0]).top - 118 + 'px';
            left = $offset(element[0]).left - 55 + 'px';
            div.style.cssText = 'top: ' + top + ';left: ' + left;

            div.style.visibility = 'visible';
            div.style.animation = 'dialog .5s';
          }).on('mouseleave', function() {
            div.style.visibility = 'hidden';
            div.style.animation = 'none';
          });
        }
      };
    }
  ]);
});
