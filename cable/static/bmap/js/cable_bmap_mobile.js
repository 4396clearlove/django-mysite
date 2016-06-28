//var pointArray = [];

/*
var laglngArray = [[113.580224,22.729894],[113.220176,23.446661],[113.770023,23.332026],[113.385643,23.166129]];
var pointArray = [];
$.each(laglngArray, function(i){
    var pointObj = new BMap.Point(laglngArray[i][0],laglngArray[i][1]);
    pointArray.push(pointObj);
    }
);

//google坐标节点
var googlepoint = new BMap.Point(113.3191263321954,23.10902839844264);
var googlepoint2 = new BMap.Point(113.3195136134808,23.10938825042231)
var convertor = new BMap.Convertor();*/

var map = new BMap.Map("map");
var zTreeOverlay = {} //全局变量，用于存zTreeId对应的百度图层类容

//map.enableScrollWheelZoom(); //开启通过滚轮缩放
map.centerAndZoom("广州", 10); //初始化显示
map.addEventListener("touchstart",function(e){
    //console.log(e.domEvent.target);
    //alert(e.domEvent.target);
    var polyline = $.data(document.body,"x");
    if(BMapLib.GeoUtils.isPointOnPolyline(e.point, polyline, map)){
        console.log('true');
        var distance = (getDistanceByPoint(e.point, polyline)/1000).toFixed(2);
        var totalDis = (BMapLib.GeoUtils.getPolylineDistance(polyline)/1000).toFixed(2);
        var subdis = (totalDis - distance).toFixed(2);
        $("#message").css('display','block');
        $("#message")[0].innerHTML = "<p>距离A点：" + distance + "KM</p><p>距离B点：" + subdis + "KM</p><p>总长：" + totalDis + "KM</p>";  //得加[0]                        
    }else{
        console.log('false');
        $("#message").css('display','none');
    }
})

/*
var MapTypeControl = new BMap.MapTypeControl({
    "mapTypes": [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]
});
MapTypeControl.setOffset(new BMap.Size(65, 10))
map.addControl(MapTypeControl);

var PanoramaControl = new BMap.PanoramaControl() //添加实景控件
map.addControl(PanoramaControl);
*/
//map.setMapStyle({style:"dark"});  //设置地图背景色

//InfoOverlay生成的DIV绑定的事件
function BMap_pop_div_click(e,obj){
    //console.log(e.target);
    if($(e.target).attr('class')=="BMap_pop_close"){
        obj.style.display="none";
    }
    e.stopPropagation();
}

// 定义自定义覆盖物的构造函数  
function InfoOverlay(center) {
    this._center = center;
    this._length = 100;
    //this._color = color;
}


// 继承API的BMap.Overlay    
InfoOverlay.prototype = new BMap.Overlay();

// 实现初始化方法  
InfoOverlay.prototype.initialize = function(map) {
    // 保存map对象实例   
    this._map = map;
    // 创建div元素，作为自定义覆盖物的容器   
    var div = document.createElement("div");
    //div.onClick = BMap_pop_div_click;
    //div.setAttribute("onclick", "javascript:alert('This is a test!')"); 
    div.setAttribute("onclick", "BMap_pop_div_click(event,this)"); 
    div.className = "BMap_pop";
    div.style.boxSizing = "content-box";
    div.style.position = "absolute";
    div.style.cursor = "default";
    //div.style.width = this._length + "px";
    var idObj = $.data(document.body, "BMap_pop_id");

    //下面的代码用于缓存创建的div的ID值，可以考虑删除
    if(idObj==undefined){
        var id = "BMap_pop_"+0;
        div.id = id;
        idObj = new Array();
        idObj.push(id);
        $.data(document.body, "BMap_pop_id", idObj);
    }else{
        var id = "BMap_pop_"+idObj.length;
        div.id = id;
        idObj.push(id);
        $.data(document.body, "BMap_pop_id", idObj);
    }

    var innerHTML = '<div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 0px; top: 0px; width: 25px; height: 25px;" id="BMap_pop_top"><div style="box-sizing:content-box;background:#fff;border-top:1px solid #ababab;border-left:1px solid #ababab;width:30px;height:30px;"></div></div><div class="BMap_top" style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 25px; top: 0px; width: 304px; height: 25px;"></div><div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 329px; top: 0px; width: 25px; height: 25px;"><div style="box-sizing:content-box;position:absolute;top:0;left:-6px;background:#fff;border-top:1px solid #ababab;border-right:1px solid #ababab;width:30px;height:30px;"></div></div><div class="BMap_center" style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 0px; top: 25px; width: 352px; height: 229px;"></div><div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 0px; top: 254px; width: 25px; height: 25px;"><div style="box-sizing:content-box;position:absolute;top:-6px;left:0;background:#fff;border-bottom:1px solid #ababab;border-left:1px solid #ababab;width:30px;height:30px;"></div></div><div class="BMap_bottom" style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 25px; top: 254px; width: 304px; height: 24px;"></div><div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 329px; top: 254px; width: 25px; height: 25px;" class="BMap_pop_bottom"><div style="box-sizing:content-box;position:absolute;top:-6px;left:-6px;background:#fff;border-right:1px solid #ababab;border-bottom:1px solid #ababab;width:30px;height:30px;"></div></div><div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 160px; top: 254px; width: 34px; height: 50px;" class="BMap_pop_bottom_sharp"><img style="box-sizing:content-box;border:none;margin:0px;padding:0px;margin-left:-186px;margin-top:-691px;max-width:none; width:690px;height:786px;" src="http://api0.map.bdimg.com/images/iw3.png" /></div><div id="test" style="box-sizing: content-box; width: 322px; height: 247px; position: absolute; left: 16px; top: 16px; z-index: 10; overflow: hidden;"><div class="BMap_bubble_title" style="overflow: hidden; height: auto; line-height: 24px; white-space: nowrap; width: auto;"><div style="height:26px;" id="detailDiv"><a filter="detailInfo" href="http://api.map.baidu.com/place/detail?uid=b1f664d1a3e2c8c1b6f42fe2&amp;output=html&amp;source=jsapi&amp;operate=mapclick&amp;clicktype=tile" target="_blank" style="font-size: 14px; color: rgb(77, 77, 77); font-weight: bold; text-decoration: none;" onmouseover="this.style.textDecoration=&quot;underline&quot;;this.style.color=&quot;#3d6dcc&quot;" onmouseout="this.style.textDecoration=&quot;none&quot;;this.style.color=&quot;#4d4d4d&quot;">峻森商住小区</a><a filter="detailLink" href="http://api.map.baidu.com/place/detail?uid=b1f664d1a3e2c8c1b6f42fe2&amp;output=html&amp;source=jsapi&amp;operate=mapclick&amp;clicktype=tile" target="_blank" style="font-size: 12px; color: rgb(61, 109, 204); margin-left: 5px; text-decoration: none;" onmouseover="this.style.textDecoration=&quot;underline&quot;" onmouseout="this.style.textDecoration=&quot;none&quot;">详情&raquo;</a></div></div><div class="BMap_bubble_content" style="width: auto; height: auto;"><div style="font-size: 12px; padding: 5px 0px; overflow: hidden;"><div class="panoInfoBox" id="panoInfoBox" title="峻森商住小区外景"><img filter="pano_thumnail_img" class="pano_thumnail_img" width="323" height="101" border="0" alt="峻森商住小区外景" src="http://pcsv0.map.bdimg.com/pr/?qt=poiprv&amp;uid=b1f664d1a3e2c8c1b6f42fe2&amp;width=323&amp;height=101&amp;quality=80&amp;fovx=200" id="pano_b1f664d1a3e2c8c1b6f42fe2" /><div filter="panoInfoBoxTitleBg" class="panoInfoBoxTitleBg"></div><a href="javascript:void(0)" filter="panoInfoBoxTitleContent" class="panoInfoBoxTitleContent">进入全景&gt;&gt;</a></div><p style="padding: 0px; margin: 0px; line-height: 18px; font-size: 12px; color: rgb(77, 77, 77);">地址：广州市萝岗区</p><p style="padding: 0px; margin: 0px; line-height: 18px; font-size: 12px; color: rgb(127, 127, 127);">标签：房地产 住宅区 小区</p></div><div style="font-size: 12px;"><div style="margin-top: 5px; overflow: hidden; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px 0px repeat-x;"><span style="float: left; text-align: center; line-height: 18px; padding: 6px 0px; cursor: pointer; width: 106px; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -44px repeat-x;"><img src="http://api0.map.bdimg.com/images/blank.gif" style="border:none;vertical-align:-3px;margin-right:5px;_vertical-align:0;width:14px;height:14px;background:url(http://api0.map.bdimg.com/images/iw_bg.png) no-repeat -30px -136px;" />在附近找</span><span style="float: left; text-align: center; line-height: 18px; padding: 6px 0px; border-left-width: 1px; border-left-style: solid; border-left-color: rgb(218, 218, 218); cursor: pointer; width: 106px;"><img src="http://api0.map.bdimg.com/images/blank.gif" style="border:none;vertical-align:-3px;margin-right:5px;_vertical-align:0;width:10px;height:15px;background:url(http://api0.map.bdimg.com/images/iw_bg.png) no-repeat -15px -136px;" />到这里去</span><span style="float: left; text-align: center; line-height: 18px; padding: 6px 0px; border-left-width: 1px; border-left-style: solid; border-left-color: rgb(218, 218, 218); cursor: pointer; width: 108px;"><img src="http://api0.map.bdimg.com/images/blank.gif" style="border:none;vertical-align:-3px;margin-right:5px;_vertical-align:0;width:10px;height:15px;background:url(http://api0.map.bdimg.com/images/iw_bg.png) no-repeat 0px -136px;" />从这里出发</span></div><div style="padding: 10px 5px 0px;"><div style="margin-top: 4px; margin-right: 3px; white-space: nowrap; float: left;"><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 0px; cursor: pointer;">酒店</a><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 6px; cursor: pointer;">餐馆</a><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 6px; cursor: pointer;">银行</a><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 6px; cursor: pointer;">医院</a><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 6px; cursor: pointer;">公交站</a></div><input type="text" id="tangram-suggestion--TANGRAM__2g-input" autocomplete="off" style="height: 22px; line-height: 22px; padding: 0px; margin: 0px; border: 1px solid rgb(165, 172, 178); width: 85px;" /><input type="button" value="搜索" style="border: 0px; height: 25px; line-height: 25px; margin: 0px 0px 0px 5px; vertical-align: bottom; width: 50px; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -87px repeat-x;" /></div><div style="padding: 10px 5px 0px; display: none;"><span style="margin-right: 5px;">起点</span><input type="text" id="tangram-suggestion--TANGRAM__2z-input" autocomplete="off" style="height: 22px; line-height: 22px; padding: 0px; margin: 0px; border: 1px solid rgb(165, 172, 178); width: 125px;" /><input type="button" value="公交" style="border: 0px; width: 47px; height: 25px; line-height: 25px; margin: 0px 0px 0px 5px; vertical-align: bottom; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -87px repeat-x;" /><input type="button" value="驾车" style="border: 0px; width: 47px; height: 25px; line-height: 25px; margin: 0px 0px 0px 5px; vertical-align: bottom; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -87px repeat-x;" /><input type="button" value="导航" style="border: 0px; width: 47px; height: 25px; line-height: 25px; margin: 0px 0px 0px 5px; vertical-align: bottom; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -87px repeat-x;" /></div></div></div><div class="BMap_bubble_max_content" style="display:none;position:relative"></div></div><img class="BMap_pop_close" style="position: absolute; top: 12px; width: 10px; height: 10px; cursor: pointer; z-index: 10000; left: 329px;" src="http://api0.map.bdimg.com/images/iw_close1d3.gif" /><img style="position:absolute;top:12px;width:10px;height:10px;-moz-user-select:none;cursor:pointer;z-index:10000;display:none" src="http://api0.map.bdimg.com/images/quanjing.png" title="进入全景" /><img style="position:absolute;top:10px;width:9px;height:14px;-moz-user-select:none;cursor:pointer;z-index:10000;display:none;" src="http://api0.map.bdimg.com/images/phone.png" title="发送到手机" /><img style="position: absolute; top: 12px; width: 10px; height: 10px; cursor: pointer; z-index: 10000; display: none; left: 309px;" src="http://api0.map.bdimg.com/images/iw_plus1d3.gif" /><div style="position: absolute; top: 0px; left: 0px; z-index: 10000; width: 354px;"></div>';
    //var innerHTML = '<div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 0px; top: 0px; width: 25px; height: 25px;"><div style="box-sizing:content-box;background:#fff;border-top:1px solid #ababab;border-left:1px solid #ababab;width:30px;height:30px;"></div></div><div class="BMap_top" style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 25px; top: 0px; width: 304px; height: 25px;"></div><div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 329px; top: 0px; width: 25px; height: 25px;"><div style="box-sizing:content-box;position:absolute;top:0;left:-6px;background:#fff;border-top:1px solid #ababab;border-right:1px solid #ababab;width:30px;height:30px;"></div></div><div class="BMap_center" style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 0px; top: 25px; width: 352px; height: 229px;"></div><div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 0px; top: 254px; width: 25px; height: 25px;"><div style="box-sizing:content-box;position:absolute;top:-6px;left:0;background:#fff;border-bottom:1px solid #ababab;border-left:1px solid #ababab;width:30px;height:30px;"></div></div><div class="BMap_bottom" style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 25px; top: 254px; width: 304px; height: 24px;"></div><div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 329px; top: 254px; width: 25px; height: 25px;"><div style="box-sizing:content-box;position:absolute;top:-6px;left:-6px;background:#fff;border-right:1px solid #ababab;border-bottom:1px solid #ababab;width:30px;height:30px;"></div></div><div style="box-sizing: content-box; overflow: hidden; z-index: 1; position: absolute; left: 160px; top: 254px; width: 34px; height: 50px;"><img style="box-sizing:content-box;border:none;margin:0px;padding:0px;margin-left:-186px;margin-top:-691px;max-width:none; width:690px;height:786px;" src="http://api0.map.bdimg.com/images/iw3.png" /></div><div id="test" style="box-sizing: content-box; width: 322px; height: 247px; position: absolute; left: 16px; top: 16px; z-index: 10; overflow: hidden;"><div class="BMap_bubble_title" style="overflow: hidden; height: auto; line-height: 24px; white-space: nowrap; width: auto;"><div style="height:26px;" id="detailDiv"><a filter="detailInfo" href="http://api.map.baidu.com/place/detail?uid=b1f664d1a3e2c8c1b6f42fe2&amp;output=html&amp;source=jsapi&amp;operate=mapclick&amp;clicktype=tile" target="_blank" style="font-size: 14px; color: rgb(77, 77, 77); font-weight: bold; text-decoration: none;" onmouseover="this.style.textDecoration=&quot;underline&quot;;this.style.color=&quot;#3d6dcc&quot;" onmouseout="this.style.textDecoration=&quot;none&quot;;this.style.color=&quot;#4d4d4d&quot;">峻森商住小区</a><a filter="detailLink" href="http://api.map.baidu.com/place/detail?uid=b1f664d1a3e2c8c1b6f42fe2&amp;output=html&amp;source=jsapi&amp;operate=mapclick&amp;clicktype=tile" target="_blank" style="font-size: 12px; color: rgb(61, 109, 204); margin-left: 5px; text-decoration: none;" onmouseover="this.style.textDecoration=&quot;underline&quot;" onmouseout="this.style.textDecoration=&quot;none&quot;">详情&raquo;</a></div></div><div class="BMap_bubble_content" style="width: auto; height: auto;"><div style="font-size: 12px; padding: 5px 0px; overflow: hidden;"><div class="panoInfoBox" id="panoInfoBox" title="峻森商住小区外景"><img filter="pano_thumnail_img" class="pano_thumnail_img" width="323" height="101" border="0" alt="峻森商住小区外景" src="http://pcsv0.map.bdimg.com/pr/?qt=poiprv&amp;uid=b1f664d1a3e2c8c1b6f42fe2&amp;width=323&amp;height=101&amp;quality=80&amp;fovx=200" id="pano_b1f664d1a3e2c8c1b6f42fe2" /><div filter="panoInfoBoxTitleBg" class="panoInfoBoxTitleBg"></div><a href="javascript:void(0)" filter="panoInfoBoxTitleContent" class="panoInfoBoxTitleContent">进入全景&gt;&gt;</a></div><p style="padding: 0px; margin: 0px; line-height: 18px; font-size: 12px; color: rgb(77, 77, 77);">地址：广州市萝岗区</p><p style="padding: 0px; margin: 0px; line-height: 18px; font-size: 12px; color: rgb(127, 127, 127);">标签：房地产 住宅区 小区</p></div><div style="font-size: 12px;"><div style="margin-top: 5px; overflow: hidden; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px 0px repeat-x;"><span style="float: left; text-align: center; line-height: 18px; padding: 6px 0px; cursor: pointer; width: 106px; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -44px repeat-x;"><img src="http://api0.map.bdimg.com/images/blank.gif" style="border:none;vertical-align:-3px;margin-right:5px;_vertical-align:0;width:14px;height:14px;background:url(http://api0.map.bdimg.com/images/iw_bg.png) no-repeat -30px -136px;" />在附近找</span><span style="float: left; text-align: center; line-height: 18px; padding: 6px 0px; border-left-width: 1px; border-left-style: solid; border-left-color: rgb(218, 218, 218); cursor: pointer; width: 106px;"><img src="http://api0.map.bdimg.com/images/blank.gif" style="border:none;vertical-align:-3px;margin-right:5px;_vertical-align:0;width:10px;height:15px;background:url(http://api0.map.bdimg.com/images/iw_bg.png) no-repeat -15px -136px;" />到这里去</span><span style="float: left; text-align: center; line-height: 18px; padding: 6px 0px; border-left-width: 1px; border-left-style: solid; border-left-color: rgb(218, 218, 218); cursor: pointer; width: 108px;"><img src="http://api0.map.bdimg.com/images/blank.gif" style="border:none;vertical-align:-3px;margin-right:5px;_vertical-align:0;width:10px;height:15px;background:url(http://api0.map.bdimg.com/images/iw_bg.png) no-repeat 0px -136px;" />从这里出发</span></div><div style="padding: 10px 5px 0px;"><div style="margin-top: 4px; margin-right: 3px; white-space: nowrap; float: left;"><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 0px; cursor: pointer;">酒店</a><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 6px; cursor: pointer;">餐馆</a><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 6px; cursor: pointer;">银行</a><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 6px; cursor: pointer;">医院</a><a filter="query" style="color: rgb(61, 109, 204); text-decoration: none; margin-left: 6px; cursor: pointer;">公交站</a></div><input type="text" id="tangram-suggestion--TANGRAM__2g-input" autocomplete="off" style="height: 22px; line-height: 22px; padding: 0px; margin: 0px; border: 1px solid rgb(165, 172, 178); width: 85px;" /><input type="button" value="搜索" style="border: 0px; height: 25px; line-height: 25px; margin: 0px 0px 0px 5px; vertical-align: bottom; width: 50px; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -87px repeat-x;" /></div><div style="padding: 10px 5px 0px; display: none;"><span style="margin-right: 5px;">起点</span><input type="text" id="tangram-suggestion--TANGRAM__2z-input" autocomplete="off" style="height: 22px; line-height: 22px; padding: 0px; margin: 0px; border: 1px solid rgb(165, 172, 178); width: 125px;" /><input type="button" value="公交" style="border: 0px; width: 47px; height: 25px; line-height: 25px; margin: 0px 0px 0px 5px; vertical-align: bottom; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -87px repeat-x;" /><input type="button" value="驾车" style="border: 0px; width: 47px; height: 25px; line-height: 25px; margin: 0px 0px 0px 5px; vertical-align: bottom; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -87px repeat-x;" /><input type="button" value="导航" style="border: 0px; width: 47px; height: 25px; line-height: 25px; margin: 0px 0px 0px 5px; vertical-align: bottom; background: url(&quot;http://api0.map.bdimg.com/images/iw_bg.png&quot;) 0px -87px repeat-x;" /></div></div></div><div class="BMap_bubble_max_content" style="display:none;position:relative"></div></div>';
    //innerHTML = innerHTML+'<img id="'+BMap_pop_close_id+'" style="position: absolute; top: 12px; width: 10px; height: 10px; cursor: pointer; z-index: 10000; left: 329px;" src="http://api0.map.bdimg.com/images/iw_close1d3.gif" /><img style="position:absolute;top:12px;width:10px;height:10px;-moz-user-select:none;cursor:pointer;z-index:10000;display:none" src="http://api0.map.bdimg.com/images/quanjing.png" title="进入全景" /><img style="position:absolute;top:10px;width:9px;height:14px;-moz-user-select:none;cursor:pointer;z-index:10000;display:none;" src="http://api0.map.bdimg.com/images/phone.png" title="发送到手机" /><img style="position: absolute; top: 12px; width: 10px; height: 10px; cursor: pointer; z-index: 10000; display: none; left: 309px;" src="http://api0.map.bdimg.com/images/iw_plus1d3.gif" /><div style="position: absolute; top: 0px; left: 0px; z-index: 10000; width: 354px;"></div>'
    //innerHTML = innerHTML+'<img style="position: absolute; top: 12px; width: 10px; height: 10px; cursor: pointer; z-index: 10000; left: 329px;" src="http://api0.map.bdimg.com/images/iw_close1d3.gif" /><img style="position:absolute;top:12px;width:10px;height:10px;-moz-user-select:none;cursor:pointer;z-index:10000;display:none" src="http://api0.map.bdimg.com/images/quanjing.png" title="进入全景" /><img style="position:absolute;top:10px;width:9px;height:14px;-moz-user-select:none;cursor:pointer;z-index:10000;display:none;" src="http://api0.map.bdimg.com/images/phone.png" title="发送到手机" /><img style="position: absolute; top: 12px; width: 10px; height: 10px; cursor: pointer; z-index: 10000; display: none; left: 309px;" src="http://api0.map.bdimg.com/images/iw_plus1d3.gif" /><div style="position: absolute; top: 0px; left: 0px; z-index: 10000; width: 354px;"></div>'
    //div.style.position = "absolute";
    // 可以根据参数设置元素外观
    
    div.innerHTML = innerHTML;
    //div.style.background = this._color;
    // 将div添加到覆盖物容器中   
    map.getPanes().floatPane.appendChild(div); //放置在markerPane层，有六层，参考笔记
    // 保存div实例   
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、   
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。   
    return div;
}

// 实现绘制方法   
InfoOverlay.prototype.draw = function() {
    // 根据地理坐标转换为像素坐标，并设置给容器    
    var position = this._map.pointToOverlayPixel(this._center);
    //console.log('x:'+position.x);
    //console.log('y:'+position.y);
    //this._div.style.left = position.x - this._length / 2 + "px";
    //this._div.style.top = position.y - this._length / 2 + "px";
    this._div.style.left = position.x - 160 + "px"; //计算得出偏移160
    this._div.style.top = position.y - 304 + "px";
    //this._div.style.left = position.x + "px";
    //this._div.style.top = position.y + "px";
}

// 实现显示方法    
InfoOverlay.prototype.show = function() {
        if (this._div) {
            this._div.style.display = "block";
        }
    }
    // 实现隐藏方法  
InfoOverlay.prototype.hide = function() {
    if (this._div) {
        this._div.style.display = "none";
    }
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
                    // var label = new BMap.Label("", {
                    //     offset: new BMap.Size(-40, -65)
                    // }); //指示label，不在ajax中定义

                    // label.setStyle({
                    //     //offset: new BMap.Size(-18,20),
                    //     //backgroundColor: 'transparent',
                    //     color: "#68EB62",
                    //     fontSize: "14px",
                    //     //backgroundColor :"#C6C1C1",
                    //     border: "0",
                    //     fontWeight: "bold"
                    // })
                    // label.hide(); //开始时隐藏悬浮框

                    // //map.addOverlay(label);

                    var polyline = new BMap.Polyline(result, { //折线，不在ajax中定义
                        strokeWeight: 4,
                        strokeColor: "#FB054B"
                    }); //设置折线

                     $.data(document.body, "x", polyline); 

                    // var contextMenu = new BMap.ContextMenu();
                    // var contextPoint;
                    // contextMenu.addEventListener('open', function(e) {
                    //     contextPoint = e.point;
                    // }); //获取右键打开时的经纬度
                    // var menuItemAdd = new BMap.MenuItem('添加标注', function() {
                    //     //alert(contextPoint.lat + ' ' + contextPoint.lng);
                    //     //var marker = new BMap.Marker(contextPoint);
                    //     var infoWindow = new InfoOverlay(contextPoint);
                    //     map.addOverlay(infoWindow);
                    //     //同时创建小图标
                    //     //var pt = new BMap.Point(contextPoint);
                    //     var myIcon = new BMap.Icon("/static/bmap/pic/icon/MapMarker_PushPin__Azure.png", 
                    //                                 new BMap.Size(30,30), 
                    //                                 {
                    //                                     imageSize:new BMap.Size(30,30),
                    //                                     anchor:new BMap.Size(15,30)
                    //                                 }
                    //                             );
                    //     var markerIcon = new BMap.Marker(contextPoint,{icon:myIcon});  // 创建标注
                    //     markerIcon.addEventListener('click',function(){
                    //         infoWindow.show();
                    //     });
                    //     map.addOverlay(markerIcon);         //将标注添加到地图中
                    //     //map.addOverlay(marker);
                    //     //var infoWindow = new BMap.InfoWindow('<p style="color:red">This is a test<p>');
                    //     //map.addOverlay(infoWindow, contextPoint);
                    //     //map.openInfoWindow(infoWindow,contextPoint);   //地图上同时只能有一个infoWindow
                    // });
                    // contextMenu.addItem(menuItemAdd);
                    // polyline.addContextMenu(contextMenu);

                    // var totalDis = (getDistanceByPoint(result[result.length - 1], polyline) / 1000).toFixed(2);
                    // //var totalDis = BMap.
                    // var markerStart = new BMap.Marker(result[0]); //起点，不在ajax中定义
                    // var labelStart = new BMap.Label("起点", {
                    //     offset: new BMap.Size(20, -10)
                    // });
                    // markerStart.setLabel(labelStart);

                    // var markerEnd = new BMap.Marker(result.pop()); //终点，不在ajax中定义
                    // var labelEnd = new BMap.Label("终点", {
                    //     offset: new BMap.Size(20, -10)
                    // });
                    // markerEnd.setLabel(labelEnd);

                    //polyline.addEventListener('touchstart', function(e){alert('test');}); //只有map可以添加touchstart事件

                    // polyline.addEventListener('click', function(e) {


                    //     var point = e.point;
                    //     var dis = (getDistanceByPoint(point, polyline) / 1000).toFixed(2);
                    //     var subdis = (totalDis - dis).toFixed(2);
                    //     label.setPosition(point);
                    //     label.setContent("<p>距离A点：" + dis + "KM</p><p>距离B点：" + subdis + "KM</p><p>总长：" + totalDis + "KM</p>");
                    //     label.show(); //进入折线，显示悬浮框
                    //     map.addOverlay(label);
                    // });

                    // polyline.addEventListener('mouseout', function(e) {
                    //     //console.log('out');
                    //     label.hide(); //移出折线，隐藏悬浮框
                    // });
                    //polyline.addListen('')
                    map.addOverlay(polyline);
                    // map.addOverlay(label);
                    // map.addOverlay(markerStart);
                    // map.addOverlay(markerEnd);
                    map.setViewport(polyline.getPath());

                    /*
                    //如果是手机浏览器的话，是用canvas展示折线，PC浏览器是通过SVG展示
                    $("canvas")[0].addEventListener('touchstart', function(e){
                        console.log(e);
                    },false);   //为画布添加事件
                    */
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
        
        }
    });
}

/**
 * [storeOverlay description]
 * @param  {num} ztreeid      [ztreeID]
 * @param  {Array} overlayArray [覆盖物数组]
 * @return None
 */
function storeOverlay(ztreeid, overlayArray) {
    zTreeOverlay[ztreeid] = overlayArray; //zTreeOverlay是一个全局变量
}

function removeOverlay(ztreeid) {
    overlays = zTreeOverlay[ztreeid];
    if (overlays) {
        $.each(overlays, function(i) {
            map.removeOverlay(overlays[i]);
        });
    }
}

$('#search-button').click(function() {
    var dataPara = {
        'cableName': $('#sole-input').val()
    };
    addOverlay(dataPara);
});


$('#sole-input').click(function() {
    $('#ui3-suggest-wrap').css('display', 'block');
    return false;
});

$('body').click(function() {
    $('#ui3-suggest-wrap').hide();
});


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



/*
    var pts = polyline.getPath();

    var totalDis = 0;

    for(var i = 0; i < pts.length - 1; i++){
        var curPt = pts[i];
        var nextPt = pts[i + 1];
        var precision = (curPt.lng - point.lng) * (nextPt.lat - point.lat) - 
            (nextPt.lng - point.lng) * (curPt.lat - point.lat);

                       
        if(precision < 1e-3 && precision > -1e-3){//实质判断是否接近0
            var dis = BMapLib.GeoUtils.getDistance(curPt, point);
            totalDis += dis;
            console.log(precision);
            return totalDis
        }
        else{
            var dis = BMapLib.GeoUtils.getDistance(curPt, nextPt);
            totalDis += dis;
        }
    }

    return 0;
}*/

//首先判断point是否在curPt和nextPt之间，即：此判断该点是否在该线段的外包矩形内
/*
        if (point.lng >= Math.min(curPt.lng, nextPt.lng) && point.lng <= Math.max(curPt.lng, nextPt.lng) &&
            point.lat >= Math.min(curPt.lat, nextPt.lat) && point.lat <= Math.max(curPt.lat, nextPt.lat)){
            //判断点是否在直线上公式
            var precision = (curPt.lng - point.lng) * (nextPt.lat - point.lat) - 
                (nextPt.lng - point.lng) * (curPt.lat - point.lat);

            console.log(precision);               
            if(precision < 1e-3 && precision > -1e-3){//实质判断是否接近0
                var dis = BMapLib.GeoUtils.getDistance(curPt, point);
                totalDis += dis;
                return totalDis
            }
            else{
                var dis = BMapLib.GeoUtils.getDistance(curPt, nextPt);
                totalDis += dis;
            }
        }
        else{
            var dis = BMapLib.GeoUtils.getDistance(curPt, nextPt);
            totalDis += dis;
        }
    }

    return 0;
}*/