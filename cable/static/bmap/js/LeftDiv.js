$(function(){
    $.fn.zTree.init($("#tree"), setting);
})

$(".icon-reload").click(function(){
    $.fn.zTree.init($("#tree"), setting);
});

var setting = {
    async: {
        enable: true,
        url:"/bmap/ztree/getdata/",
        autoParam:["id"]     //点击父节点加载子节点时提交的数据
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
    callback: {
        onCheck: onCheck,    //选定及取消复选框调用的事件
        onDrop: onDrop,  //用于捕获节点拖拽操作结束的事件回调函数
        onClick: onClick,   //节点被点击触发

    },
    edit: {
        enable: true,
        showRemoveBtn: true,
        removeTitle: "删除",
        drag: {

        }
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
        searchFlag = true;
        $("#fm-sidebar").showLoading();
        var param = {'kw':value,'type':type};
        $.ajax({
            url: "/bmap/ztree/search/",
            data: param, //这里是js的字典
            beforeSend: function(xhr, settings) {
                var csrftoken = Cookies.get('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            type: "POST",
            //dataType: "json", //预期服务器返回的数据
            success: function(data) {
                $.fn.zTree.init($("#tree"), setting, data); //同步调用数据
                var treeSearchObj = $.fn.zTree.getZTreeObj("tree");
                treeSearchObj.expandAll(true);
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
            addOverlay(nodes[i].id, nodes[i].name); //nodes[i].Id表示节点的唯一标识，id是唯一的，如1484205616.28.826
        }else{
            removeOverlay(nodes[i].id);
        }
    });
}

function onDrop(e, treeId, treeNodes, targetNode, moveType, isCopy){
    // moveType:"inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点
    console.log(targetNode);

    if(moveType==null){
        return null
    }

    if(targetNode==null){
        var targetNodeId = null;
    } else {
        var targetNodeId = targetNode.id;
    }

    var nodeIds = [];
    $.each(treeNodes, function(i){
        nodeIds.push(treeNodes[i].id);
    });

    var param = {'moveType':moveType,'targetNodeId':targetNodeId,'nodeIds':JSON.stringify(nodeIds)};
    $.ajax({
        url: "/bmap/ztree/edit/",
        data: param, //这里是js的字典
        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        type: "POST",
        error: function() {
            alert('编辑失败！');
        }
    });
}


function onClick(e, treeId, treeNode){
    treeNode.checked=true;
    onCheck(e,treeId,treeNode)
}