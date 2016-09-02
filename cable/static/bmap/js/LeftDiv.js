$(function(){
    $.fn.zTree.init($("#tree"), setting);
})


var setting = {
    async: {
        enable: true,
        url:"/bmap/tree/getdata/",
        autoParam:["id"],     //点击父节点加载子节点时提交的数据
        // otherParam:{"otherParam":"zTreeAsyncTest"}, //提交的额外参数，包括初始化时也会提交
        // dataFilter: filter  //用于对 Ajax 返回数据进行预处理的函数,该函数最终返回zTree支持的json格式数据，附加到父节点下
    },
    check: {
        enable: true
    },
    data:{
        simpleData:{
            enable:true
        }
    },
    view: {
        fontCss: {
            //color: "red"
            //fontSize:150%
        }
    },
    // edit:{
    //     enable:true,
    //     drag:{
    //         isMove:true,
    //         inner:false
    //     }
    // },
    callback: {
        onCheck: onCheck,    //选定及取消复选框调用的事件
        onDrop: onDrop,  //用于捕获节点拖拽操作结束的事件回调函数
        onClick: onClick,   //节点被点击触发
        //onClick: onClick
    }
};


var C = function(D) {
    if (D == "close") {
        $("#fm-sidebar").animate({
            width: 26
        }, 500, function() {
            $("#fm-sidebar").toggleClass("open");
            j()
        })
    } else {
        if (D == "open") {
            //$.event.trigger("SHOW_SCROLLBAR");
            $("#fm-sidebar").animate({
                width: 350
            }, 500, function() {
                $("#fm-sidebar").toggleClass("open");
                j()
            })
        } else {
            if (D == "init") {
                $.event.trigger("SHOW_SCROLLBAR");
                $("#fm-sidebar").animate({
                    width: 350
                }, 500)
            }
        }
    }
};


$(".fm-sidectrl").click(function(D) {
    if ($("#fm-sidebar").hasClass("open")) {
        C("close")
    } else {
        C("open")
    }
});

function j() {		//点击侧边时触发，用来更改提示信息
    var E = $("#fm-sidebar-ctrl");
    var D = E.data("opt_title");
    E.data("opt_title", E.attr("title"));
    E.attr("title", D)
}


function leftDivzTreeSearch(value, type){   //点击查询时触发的事件函数
    if(value==""){
        $.messager.alert('错误','输入不能为空！');
    }else{
        $("#fm-sidebar").showLoading();
        var param = {'kw':value,'type':type};
        $.ajax({
            url: "/bmap/tree/search/",
            data: param, //这里是js的字典
            beforeSend: function(xhr, settings) {
                var csrftoken = Cookies.get('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            type: "POST",
            //dataType: "json", //预期服务器返回的数据
            success: function(data) {
                // var setting = {
                //     async: {    //搜索得出空文件夹时再次打开会进行异步加载，不过不是空文件夹就无法再进行异步加载了。
                //         enable: true,
                //         url:"/ztree/getdata/",
                //         autoParam:["id"],     //点击父节点加载子节点时提交的数据
                //         //otherParam:{"otherParam":"zTreeAsyncTest"}, //提交的额外参数，包括初始化时也会提交
                //         //dataFilter: filter  //用于对 Ajax 返回数据进行预处理的函数,该函数最终返回zTree支持的json格式数据，附加到父节点下
                //     },
                //     data:{
                //         simpleData:{
                //             enable:true
                //         }
                //     },
                //     check: {
                //         enable: true
                //     },
                //     view: {
                //         fontCss: {
                //             //color: "red"
                //             //fontSize:150%
                //         }
                //     },
                //     callback: {
                //         onCheck: onCheck,    //选定及取消复选框调用的事件
                //         onDrop: onDrop,  //用于捕获节点拖拽操作结束的事件回调函数
                //         onClick: onClick   //节点被点击触发
                //     }
                // };
                $.fn.zTree.init($("#tree"), setting, data); //同步调用数据
                var treeObj = $.fn.zTree.getZTreeObj("tree");
                treeObj.expandAll(true);
                $("#fm-sidebar").hideLoading();
            }
        });
    }
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        if (childNodes[i].iconSkin=="default") {
            // childNodes[i].icon = "/static/icon/ylw-pushpin.png"
            childNodes[i].iconSkin = "default"
        }
    }
    return childNodes;
}

function onCheck(e, treeId, treeNode) {
    if(treeNode.isParent){
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        var nodes = treeObj.getNodesByParam("isParent", false, treeNode);   //得到所有level最低的子节点
    }else{
        var nodes = [treeNode];
    }
    
    $.each(nodes,function(i){
        var flag = nodes[i].checked;
        if(flag){
            addOverlay(nodes[i].id, nodes[i].name); //nodes[i].tId表示节点的唯一标识，如112,212
        }else{
            removeOverlay(nodes[i].id);
        }
    });
}

function onDrop(e, treeId, treeNodes, targetNode, moveType, isCopy){
    console.log(targetNode);
}


function onClick(e, treeId, treeNode){
    treeNode.checked=true;
    onCheck(e,treeId,treeNode)
}