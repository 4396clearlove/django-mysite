
$(function(){
    var script = document.createElement("script");  
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=fUyHuVGV8jPlxb3wYuUGargm&callback=initialize";//此为v2.0版本的引用方式 
    document.body.appendChild(script);

    $("#easyui-tree").tree({
        animate:true,
        checkbox:true,
        //dnd:true,
        url:'/bmap/mobile/easyui_tree/',
        onCheck:function(node, checked){
            if(checked==true){
                $("#easyui-tree").tree('expand', node.target);
                addOverlay(node.id);
            }
        }
    });
});

function initialize() {  
    map = new BMap.Map('map', {enableHighResolution:true});  
    map.centerAndZoom("广州", 10);

    map.addEventListener("touchstart", function(e){
        var polyline = $.data(document.body, "x");
        if(BMapLib.GeoUtils.isPointOnPolyline(e.point, polyline, map)){
            console.log('true');
            var distance = (getDistanceByPoint(e.point, polyline)/1000).toFixed(2);
            var totalDis = (BMapLib.GeoUtils.getPolylineDistance(polyline)/1000).toFixed(2);
            var subDis = (totalDis - distance).toFixed(2);
            $("#message").css('display', 'block');
            $("#message")[0].innerHTML = "<p>距离A点：" + distance + "KM</p><p>距离B点：" + subDis + "KM</p><p>总长：" + totalDis + "KM</p>";  //得加[0]                        
        }else{
            console.log('false');
            $("#message").css('display','none');
        }
    });
}


/**
 * [根据参数查询坐标集，并在地图绘制] 
 * @param {[type]} para    [需要查询的参数]
 * @param {[type]} ztreeid [ztreeid，用于对应储存覆盖物，以便移除时调用]
 */
function addOverlay(id, name) {

    $.ajax({
        url: "/bmap/search_cable/",
        data: {'id':id}, //这里是js的字典
        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        type: "POST",
        dataType: "json", //预期服务器返回的数据
        success: function(data) {
            var placemarkType = data.placemarkType;
            var coordinateType = data.coordinateType;
            var coordinates = objToBMPoint(data.coordinates);   //注意百度的点不等于{'lng':xx,'lat':yy}
            var pk = data.pk;   //数据库中的主键值

            if(coordinateType=="GPS"){
                var pointArray = new Array();
                var pointArrays = new Array();
                var BmapConvertor = new BMap.Convertor();

                var groupNum = 0;
                var index = 0; //用于指示是否已完成纠偏
                var result = new Array(); //用于装纠偏的结果集

                $.each(coordinates, function(i) {
                    if (groupNum < 10) { //分成20个一组
                        pointArray.push(coordinates[i]);
                        groupNum++
                    } else {
                        pointArrays.push(pointArray); // 一个小组作为一个元素加入pointArrays，并将容器置空
                        groupNum = 0;
                        pointArray = [];
                        pointArray.push(coordinates[i]);
                        groupNum++
                    }
                });

                if (groupNum != 0) { //最后一组可能不足20个 
                    pointArrays.push(pointArray); //需求的结果是[[1,2..,10],[11,12,...20]]，所以不能用concat来连接数组
                }

                var convertCount = pointArrays.length; //需要调整的次数
                covert(); //循环纠偏,并显示到地图上
            }
            else if(coordinateType=="BaiDu"){
                var result = coordinates;
                generatePolyline();
            }

            function storePoints(){     //把转换后的坐标返回给数据库
                var para = {'points':JSON.stringify(result),'pk':pk};

                $.ajax({
                    url: "/bmap/store_points/",
                    data: para, //这里是js的字典
                    beforeSend: function(xhr, settings) {
                        var csrftoken = Cookies.get('csrftoken');
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    type: "POST",
                    dataType: "text", //预期服务器返回的数据
                    success: function(data) {
                        console.log(data);
                    }
                });
            }

            /**
             * [objToBMPoint description]把后端传过来的[{'lng':xx,'lat':yy},..]的obj转为BMap.Point的列表，并传出
             * @param  {[type]} objList [description]
             * @return {[type]}         [description]
             */
            function objToBMPoint(objList){
                var tmpList = new Array();
                $.each(objList,function(i){
                    tmpList.push(new BMap.Point(objList[i]['lng'],objList[i]['lat']));
                });
                return tmpList;
            }

            function covert() {
                //console.log('convert');
                var gpsPoints = pointArrays[index];
                // google转化为百度经纬度(参数2，表示是从GCJ-02坐标到百度坐标。参数1，表示是从GPS到百度坐标)  
                BmapConvertor.translate(gpsPoints, 1, 5, convertCallback);
            }

            function convertCallback(i) {
                //console.log('convertCallback');
                if (i.status == 0) {
                    result = result.concat(i.points); //数组合并，区别于110行，这里不用push来连接数组

                    index++;
                    if (index == convertCount) {
                        generatePolyline();
                        storePoints();      //把转换后的坐标返回给数据库，已便下次调用
                    } else {
                        covert(); //循环纠偏
                    }
                }
            }


            function generatePolyline() {

                if (placemarkType == 1) { //折线

                    var polyline = new BMap.Polyline(result, { //折线，不在ajax中定义
                        strokeWeight: 4,
                        strokeColor: "#FB054B"
                    }); //设置折线

                    $.data(document.body, "x", polyline); 
                    map.addOverlay(polyline);
                    map.setViewport(polyline.getPath());
                    
            } else if (placemarkType ==2 ){
                var circle = new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                    strokeColor:'blue',
                    scale:1,
                    strokeWeight:0.1,
                    fillColor:"orange",
                    fillOpacity:0.8
                });
                var marker = new BMap.Marker(result[0],{
                    "icon":circle,
                    "title":name
                });
                map.addOverlay(marker);
                map.setViewport(result);
            }

        }
        
        }
    });
}

/**
 * 得出折线中的点至起点的距离
 * @param {Point} point 点对象
 * @param {Polyline} polyline 折线对象
 * @returns {float} 返回距离
 */
getDistanceByPoint = function(point, polyline) {

    var pts = polyline.getPath();
    var totalDis = 0;
    for (var i = 0; i < pts.length - 1; i++) {
        var curPt = pts[i];
        var nextPt = pts[i + 1];
        var center = new BMap.Point((curPt.lng + nextPt.lng) / 2, (nextPt.lat + curPt.lat) / 2);
        var radius = BMapLib.GeoUtils.getDistance(curPt, nextPt) / 2 + 25;
        var circle = new BMap.Circle(center, radius); //构建圆

        if (BMapLib.GeoUtils.isPointInCircle(point, circle)) { //判断点是否在圆内
            var precision = (curPt.lng - point.lng) * (nextPt.lat - point.lat) -
                (nextPt.lng - point.lng) * (curPt.lat - point.lat);
            if (precision < 1e-3 && precision > -1e-3) { //实质判断是否接近0
                //map.addOverlay(circle);   //  用于测试
                var dis = BMapLib.GeoUtils.getDistance(curPt, point);
                totalDis += dis;
                console.log(precision);
                return totalDis
            } else {
                var dis = BMapLib.GeoUtils.getDistance(curPt, nextPt);
                totalDis += dis;
            }
        } else {
            var dis = BMapLib.GeoUtils.getDistance(curPt, nextPt);
            totalDis += dis;
        }
    }
    return 0;
}


$("#searchBtn").click(function(){
    addOverlay("1467021171.86.60754",'测试');
});


function dlgSearch(value, type){   //点击查询时触发的事件函数
    if(value==""){
        $.messager.alert('错误','输入不能为空！');
    }else{
        // $("#fm-sidebar").showLoading();
        var param = {'kw':value,'type':type};
        $.ajax({
            url: "/bmap/tree/search/",
            data: param, //这里是js的字典
            beforeSend: function(xhr, settings) {
                var csrftoken = Cookies.get('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            type: "POST",
            success: function(data) {
                // $.fn.zTree.init($("#tree"), setting, data); //同步调用数据
                // var treeObj = $.fn.zTree.getZTreeObj("tree");
                // treeObj.expandAll(true);
                // $("#fm-sidebar").hideLoading();
                $("#easyui-tree").tree('loadData',[{text:'hello',state:"closed"}])
            }
        });
    }
}