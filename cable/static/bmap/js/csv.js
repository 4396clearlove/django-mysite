var map = new BMap.Map("map", {enableMapClick:false}); //关闭地图的地图可点功能



map.enableScrollWheelZoom(); //开启通过滚轮缩放
map.centerAndZoom("广州", 10); //初始化显示

var BmapConvertor = new BMap.Convertor(); //全局变量

$(function(){
    $.ajax({
        url: "/bmap/main_polyline/",
        type: "GET",
        dataType: "json",
        success: function(data){
                var coordinates = objToBMPoint(data);   //注意百度的点不等于{'lng':xx,'lat':yy}
                handlePolyline(coordinates); //循环纠偏,并显示到地图上
            }
    });
})

var receivedPointsArrayTest = [{
        pk:'6',
        lng:'113.459425401045',
        lat:'23.1623400819347'
        //06-局前06#-预留4米 124.4
    },{
        pk:'4',
        lng:'113.459570864874',
        lat:'23.1625766162751'
        //04-局前04# 136.9
    }]

$("#submit").click(function(){
    $.ajax({
        url:"/bmap/csv/",
        type:"POST",
        dataType:"json",
        success:function(receivedPointsArray){
            //handlePoints(receivedPointsArray);
            handlePoints(receivedPointsArrayTest);
        }
    });
})

/**
 * 把后端传过来的[{'lng':xx,'lat':yy},..]obj转为BMap.Point的列表，并传出
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

/**
 * 处理未纠偏的百度点集，循环调用内部的convert与convertCallback进行纠偏
 * @param  [BMap.Point,..] coordinates 未纠偏的百度点列表
 * @return null
 */
function handlePolyline(coordinates) {
    var pointArray = new Array();
    var pointArrays = new Array();
    var groupNum = 0;
    var index = 0; //用于指示是否已完成纠偏
    var result = new Array(); //用于装纠偏的结果集。

    $.each(coordinates, function(i) {
        if (groupNum < 10) { //分成10个一组，大于10个转换时会出25的错误状态码  
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

    // var gpsPoints = pointArrays[index];
    // // google转化为百度经纬度(参数2，表示是从GCJ-02坐标到百度坐标。参数1，表示是从GPS到百度坐标)  
    // BmapConvertor.translate(gpsPoints, 1, 5, convertCallback);


    var convert = function(){
        console.log('convert');
        var gpsPoints = pointArrays[index];
        BmapConvertor.translate(gpsPoints, 1, 5, convertCallback);
    }

    convert();

    function convertCallback(i) {
        // 这里的i是纠偏后百度返回来的数据
        if (i.status == 0) {
            console.log('convertback');
            result = result.concat(i.points); //数组合并，区别于110行，这里不用push来连接数组

            index++
            if (index == convertCount) {
                polyline = new BMap.Polyline(result, { //折线，不在ajax中定义
                    strokeWeight: 7,
                    strokeStyle:"solid",
                    strokeOpacity:1,
                    strokeColor: "#FB054B"
                    //strokeColor: color
                }); //设置折线
                map.addOverlay(polyline);
                // storePoints();      //把转换后的坐标返回给数据库，已便下次调用
            } else {
                convert(); //循环纠偏
            }
        }
    }
}


function handlePoints(pointObjs) {
    var tmpPoints,tmpPks;
    var points = new Array();
    var pks = new Array();
    var pkArray = new Array();
    var pkArrays = new Array();
    var pointArray = new Array();
    var pointArrays = new Array();
    var groupNum = 0;
    var index = 0; //用于指示是否已完成纠偏
    var result = new Array(); //用于装纠偏的结果集。

    $.each(pointObjs, function(i){
        points.push(new BMap.Point(pointObjs[i]['lng'],pointObjs[i]['lat']));
        pks.push(pointObjs[i]['pk']);
    });

    $.each(points, function(i) {
        if (groupNum < 10) { //分成10个一组，大于10个转换时会出25的错误状态码  
            pointArray.push(points[i]);
            pkArray.push(pks[i]);
            groupNum++;
        } else {
            pointArrays.push(pointArray); // 一个小组作为一个元素加入pointArrays，并将容器置空
            pkArrays.push(pkArray);
            groupNum = 0;
            pointArray = [];
            pkArray = [];
            pointArray.push(points[i]);
            pkArray.push(pks[i]);
            groupNum++;
        }
    });
    if (groupNum != 0) { //最后一组可能不足20个 
        pointArrays.push(pointArray); //需求的结果是[[1,2..,10],[11,12,...20]]，所以不能用concat来连接数组
        pkArrays.push(pkArray);
    }

    var convertCount = pointArrays.length;
    convert()

    function convert(){
        var gpsPoints = pointArrays[index];
        tmpPks = pkArrays[index];
        BmapConvertor.translate(gpsPoints, 1, 5, convertCallback);
    }

    function convertCallback(i){
        if(i.status==0){
            //console.log("convertPointBack")
            index++;
            tmpPoints = i.points;
            $.each(tmpPoints,function(i){
                var marker = new BMap.Marker(tmpPoints[i]);
                map.addOverlay(marker);
                var distance = getDistanceByPoint(tmpPoints[i], polyline);
                result.push({'pk':tmpPks[i], 'distance':distance.toFixed(1)}); //全局变量    
            });
            if(index==convertCount){
                alert('success');
                //console.log(returnValue)
                $.ajax({
                    url:"/bmap/storeCSV/",
                    type:"POST",
                    data:{data:JSON.stringify(result)}
                });
            }else{
                convert()
            }
        }
    }
}

/**
 * [根据参数查询坐标集，并在地图绘制] 
 * @param {[type]} para    [需要查询的参数]
 * @param {[type]} ztreeid [ztreeid，用于对应储存覆盖物，以便移除时调用]
 */
function addOverlay(id, name) {
    $("#map").showLoading();
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
            var icon = data.icon;

            if(coordinateType=="GPS"){
                var pointArray = new Array();
                var pointArrays = new Array();
                var BmapConvertor = new BMap.Convertor();

                var groupNum = 0;
                var index = 0; //用于指示是否已完成纠偏
                var result = new Array(); //用于装纠偏的结果集

                $.each(coordinates, function(i) {
                    if (groupNum < 10) { //分成20个一组  
                        //var point = new BMap.Point(coordinates[i][0], coordinates[i][1]);
                        //pointArray.push(point)
                        pointArray.push(coordinates[i]);
                        groupNum++
                    } else {
                        pointArrays.push(pointArray); // 一个小组作为一个元素加入pointArrays，并将容器置空
                        groupNum = 0;
                        pointArray = [];
                        //var point = new BMap.Point(coordinates[i][0], coordinates[i][1]);
                        //pointArray.push(point);
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
                console.log('convert');
                var gpsPoints = pointArrays[index];
                // google转化为百度经纬度(参数2，表示是从GCJ-02坐标到百度坐标。参数1，表示是从GPS到百度坐标)  
                BmapConvertor.translate(gpsPoints, 1, 5, convertCallback);
            }

            function convertCallback(i) {
                console.log('convertCallback');
                if (i.status == 0) {
                    result = result.concat(i.points); //数组合并，区别于110行，这里不用push来连接数组

                    index++
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
                    var color = colorPicker();
                    var polyline = new BMap.Polyline(result, { //折线，不在ajax中定义
                        strokeWeight: 7,
                        strokeStyle:"solid",
                        strokeOpacity:1,
                        //strokeColor: "#FB054B"
                        strokeColor: color
                    }); //设置折线

                    var totalDis = (BMapLib.GeoUtils.getPolylineDistance(polyline)/1000).toFixed(2);
                    
                    var circleIcon = new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {  //应用矢量图标
                        strokeColor: "blue",
                        scale: 6,
                        strokeWeight: 0.1,
                        fillColor: "green",
                        fillOpacity: 0.8//填充透明度,默认是0，看不到填充的颜色
                    });

                    var markerStart = new BMap.Marker(result[0], {
                        "icon": circleIcon,
                        "title": "A端"   //ToDo，改为起点名称
                    }); //起点，不在ajax中定义
                    /*不需要显示lebel
                    var labelStart = new BMap.Label("起点", {
                        offset: new BMap.Size(20, -10)
                    });
                    markerStart.setLabel(labelStart);*/

                    var markerEnd = new BMap.Marker(result.pop(), {
                        "icon": circleIcon,
                        "title": "Z端"
                    }); //终点，不在ajax中定义

                    /*不需要显示label
                    var labelEnd = new BMap.Label("终点", {
                        offset: new BMap.Size(20, -10)
                    });
                    markerEnd.setLabel(labelEnd);*/

                    var markerShowInfo = function(e){
                        var fixed = getProximity(e.point, polyline);
                        var fixedPoint = map.overlayPixelToPoint(fixed.pixel);
                        var index = fixed.index;
                        var dis = (getDistanceByIndex(index, fixedPoint, polyline) / 1000).toFixed(2);
                        var subdis = (totalDis-dis).toFixed(2);
                        label.setPosition(fixedPoint);
                        label.setContent("<p>"+ name +"</p><p>距离A点:" + dis + "KM</p><p>距离B点:" + subdis + "KM</p><p>总长:" + totalDis + "KM</p>");
                        label.show()

                        moveCircleMarker.setPosition(fixedPoint);
                        moveCircleMarker.show();
                    }

                    polyline.addEventListener('mouseover', function(e) {
                        map.addEventListener('mousemove', markerShowInfo);
                    });

                    polyline.addEventListener('mouseout', function(e) {
                        moveCircleMarker.hide()
                        label.hide()
                        map.removeEventListener('mousemove', markerShowInfo);
                    });

                    //polyline.addListen('')
                    map.addOverlay(polyline);
                    map.addOverlay(label);
                    map.addOverlay(markerStart);
                    map.addOverlay(markerEnd);
                    map.setViewport(result);
                    if (id) {
                        storeOverlay(id, [polyline, label, markerStart, markerEnd]); //储存覆盖物，以便移除时调用
                    }
                } else if (placemarkType == 2) { //点
                    var circle = new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {  //应用矢量图标
                        strokeColor: "blue",
                        scale: 1,
                        strokeWeight: 0.1,
                        fillColor: "orange",
                        fillOpacity: 0.8//填充透明度,默认是0，看不到填充的颜色
                    });

                    var ylw_pushpin = new BMap.Icon("/static/ztree/icon/pushpin/ylw-pushpin.png", 
                                new BMap.Size(30,30), 
                                {
                                    imageSize:new BMap.Size(30,30),
                                    anchor:new BMap.Size(15,30)
                                }
                            );

                    var marker = new BMap.Marker(result[0], {
                        "icon": iconDict[icon],
                        "title": name
                    });

                    var marker2 = new BMap.Marker(result[0],{
                        "icon":new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE)
                    });


                    map.addOverlay(marker);
                    map.addOverlay(marker2);
                    map.setViewport(result);
                    if (id) {
                        storeOverlay(id, [marker]); //储存覆盖物，以便移除时调用
                    }
                }
                $("#map").hideLoading();
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
        }
    });
}


/**
 * 得出折线中的点至起点的距离，与像素无关，构造圆判断点是否在圆内来判断，但与精度有关
 * @param {Point} point 点对象
 * @param {Polyline} polyline 折线对象
 * @returns {float} 返回距离
 */
getDistanceByPoint = function(point, polyline) {

    var pts = polyline.getPath();
    var totalDis = 0;
    var flag = false;
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
                flag = true;
                var dis = BMapLib.GeoUtils.getDistance(curPt, point);
                totalDis += dis;
                console.log(precision);
                console.log(totalDis);
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
    if(!flag){
        var index;
        totalDis=0;
        var shortestDis=BMapLib.GeoUtils.getDistance(pts[0], point);;
        for (var i = 0; i < pts.length - 1; i++){
            var curPt = pts[i];
            dis = BMapLib.GeoUtils.getDistance(curPt, point);
            if(dis<shortestDis){
                index = i;
                shortestDis = dis;
            }
        }
        for (var i=0; i<index;i++){
            var curPt = pts[i];
            var nextPt = pts[i + 1];
            totalDis = totalDis + BMapLib.GeoUtils.getDistance(curPt, nextPt);
        }
        totalDis = totalDis + BMapLib.GeoUtils.getDistance(pts[index], point);
        return totalDis;
    }
    return 0;
}


/**
 * 得出折线中的点至起点的距离，与像素有关，比例尺不同得出的数据也相差很多
 * @param  {int} index      代表点位于折线的第几段
 * @param  {BMap.Point} fixedPoint 折线上的点
 * @param  {BMap.Polyline} polyline   折线
 * @return {float}            点至起点的距离
 */
function getDistanceByPointIndex(index, fixedPoint, polyline) {
    var curPt, nextPt, dis;
    var pts = polyline.getPath();
    var totalDis = 0;
    for (var i = 1; i < index; i++) {
        curPt = pts[i - 1];
        nextPt = pts[i];
        dis = BMapLib.GeoUtils.getDistance(curPt, nextPt);
        totalDis += dis;
    }
    curPt = pts[i-1];
    totalDis += BMapLib.GeoUtils.getDistance(curPt, fixedPoint);
    return totalDis
}


/**
 * 计算给定的点与折线垂直相交的节点，并返回
 * @param  {BMap.Point} point    百度地图点
 * @param  {BMap.Polyline} polyline 百度地图折线
 * @return {
 *             pixel:BMap.Pixel,
 *             dist:float,
 *             index:int
 *          }
 */
function getProximity(point, polyline) {
    var high, dist, k1, k2, index, returnX, returnY;

    var givenPixel = map.pointToOverlayPixel(point);
    var polylinePixelList = getPolylinePixel(polyline);
    for(var i = 1; i<polylinePixelList.length; i++){
        var curPixel = polylinePixelList[i-1];
        var nextPixel = polylinePixelList[i];
        if(curPixel.x != nextPixel.x){
            var k = (nextPixel.y - curPixel.y) / (nextPixel.x - curPixel.x );
            var unknown = nextPixel.y - k*nextPixel.x;  //不知道为什么这么求高??
            high = Math.abs(k*givenPixel.x+unknown-givenPixel.y)/Math.sqrt(k*k+1);    //不知道为什么这么求高??
        } else {
            high = Math.abs(givenPixel.x - nextPixel.x);
        }
        var curNextDis2 = Math.pow(nextPixel.y - curPixel.y, 2) + Math.pow(nextPixel.x - curPixel.x, 2);  //三条边长的平方 
        var nextGivenDist2 = Math.pow(nextPixel.y - givenPixel.y, 2) + Math.pow(nextPixel.x - givenPixel.x, 2);
        var curGivenDist2 = Math.pow(curPixel.y - givenPixel.y, 2) + Math.pow(curPixel.x - givenPixel.x, 2);
        var high2 = Math.pow(high, 2); //高的平方
        var e = nextGivenDist2 - high2 + curGivenDist2 - high2;  //勾股定理
        if(e > curNextDis2) { //说明高在三角形以外
            high = Math.sqrt(Math.min(nextGivenDist2, curGivenDist2));  //这时不计算高，而是取Given节点到Cur与Next节点的最短边
        }
        if ((dist == null) || (dist > high)) {
            k1 = Math.sqrt(curGivenDist2-high2) / Math.sqrt(curNextDis2);
            k2 = Math.sqrt(nextGivenDist2-high2) / Math.sqrt(curNextDis2);
            dist = high;
            index = i;
        }
        dist = Math.min(dist, high); //得最短距离
    }

    if (k1 > 1) {
        k1 = 1
    }
    if (k2 > 1) {
        k1 = 0;
        k2 = 1
    }
    var betweenx = polylinePixelList[index - 1].x - polylinePixelList[index].x;
    var betweeny = polylinePixelList[index - 1].y - polylinePixelList[index].y;
    returnX = polylinePixelList[index - 1].x - (betweenx * k1);
    returnY = polylinePixelList[index - 1].y - (betweeny * k1);
    return {
        pixel: new BMap.Pixel(returnX,returnY),
        dist: dist,
        index: index //用于索引数组计算距离
    }
}



function getPolylinePixel(polyline){
    var pixelList = [];
    var pointList = polyline.getPath();
    for(var i=0;i<pointList.length;i++){
        pixelList.push(map.pointToOverlayPixel(pointList[i]));
    }
    return pixelList
}