define(['./controller', 'heatmap'], function(controller) {
  'use strict';

  controller.controller('HeatmapCtrl', [
    '$scope', '$http', '$session', '$compile',
    function($scope, $http, $session, $compile) {
      var storeImgUrl = $session.getItem('loginUser').account.store.showPath,
        radius = 30, //热点的半径
        hover_r = 20, //鼠标信息点的大小
        img = document.getElementById('heatmapImg'),
        heatmap = document.getElementById('heatmap');

      $scope.src = storeImgUrl || '';

      //获取图片的本来宽度
      function originWidth(src, callback) {
        var img = new Image;
        img.src = src;

        img.onload = function() {
          callback(img.width, img.height);
        };
      }

      //修正数据符合缩放
      function scaleData(scale, datas) {

        for (var i = 0, len = datas.length; i < len; i++) {
          var d = datas[i];
          d.x *= scale.x;
          d.y *= scale.y;
          //修正为控件能用的格式
          d.value = parseInt(d.num);
          delete d.num;
        }
      }

      /**
       * 添加鼠标事件
       * 鼠标移到热图上面，会有相应的位置的数据
       * @param  {json} datas 热图数据
       * @param  {json} frame 边框信息
       */
      function addScanEvent(datas, frame) {
        //信息点的横纵个数
        var num = {
            x: parseInt(frame.x / hover_r),
            y: parseInt(frame.y / hover_r)
          },
          i, j, len, jLen, infoPoint; //循环的索引，代码检测程序老报，放前边

        for (i = 0; i < num.x; i++) {
          var x = i * hover_r;

          for (j = 0; j < num.y; j++) {
            var y = j * hover_r;
            infoPoint = document.createElement('div');
            infoPoint.style.left = x + 'px';
            infoPoint.style.top = y + 'px';
            infoPoint.style.width = hover_r + 'px';
            infoPoint.style.height = hover_r + 'px';
            infoPoint.style.lineHeight = hover_r + 'px';
            heatmap.appendChild(infoPoint);
          }
        }

        var infoPoints = heatmap.getElementsByTagName('div');

        for (i = 0, len = datas.length; i < len; i++) {
          var d = datas[i];

          for (j = 0, jLen = infoPoints.length; j < jLen; j++) {
            infoPoint = infoPoints[j];
            var num = parseInt(infoPoint.innerHTML) || 0,
              ip_x = infoPoint.offsetLeft,
              ip_y = infoPoint.offsetTop,
              accord = {
                x: {
                  min: ip_x, //x最小值
                  max: ip_x + hover_r //y最大值
                },
                y: {
                  min: ip_y, //y最小值
                  max: ip_y + hover_r //y最大值
                }
              };

            if (d.x >= accord.x.min && d.x <= accord.x.max && d.y >= accord.y.min && d.y <= accord.y.max) {
              num += d.value;
            }
            infoPoint.innerHTML = num;
          }
        }
      }

      $scope.updateData = function(startDate, endDate) {
        $scope.loadData = true;
        //设定热图外框
        var l_x = img.offsetLeft; //图片左边距
        heatmap.style.left = l_x + 'px';
        heatmap.style.width = img.clientWidth + 'px';
        heatmap.style.height = img.clientHeight + 'px';
        //重置热图控件
        heatmap.innerHTML = '';
        var heatmapInstance = h337.create({
          container: document.getElementById('heatmap'),
          radius: radius
        });
        //计算缩放比例，导入热图数据
        var src = img.getAttribute('src'); //图片的src
        originWidth(src, function(real_w, real_h) {

          var scale = {
            x: img.clientWidth / real_w,
            y: img.clientHeight / real_h
          };

          $http({
            url: '/wlwx/resultMatch',
            method: 'GET',
            params: {
              beginDateTime: startDate,
              endDateTime: endDate
            }
          }).
          success(function(response) {
            $scope.loadData = false;

            if (response.length !== 0) {
              var dataArr = [], //给控件的值
                maxValue = 0;

              scaleData(scale, response);
              addScanEvent(response, {
                x: img.clientWidth,
                y: img.clientHeight
              });

              //找出最大值
              for (var i = 0, len = response.length; i < len; i++) {
                var value = response[i].value;

                if (value > maxValue) {
                  maxValue = value;
                }
              }
              //将数据载入控件
              heatmapInstance.setData({
                max: maxValue,
                min: 0,
                data: response
              });

              $scope.hasData = true;

            } else {
              $scope.hasData = false;
            }
          });
        });
      };
    }
  ]);
});