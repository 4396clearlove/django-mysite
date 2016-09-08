$(function(){
    $.fn.zTree.init($("#tree"), setting);
})


/*
$(function(){
    var ztreeJson;
    $.ajax({
        url: "/bmap/get_ztree_nodes/",
        //data: para, //这里是js的字典
        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        type: "POST",
        dataType: "json", //预期服务器返回的数据
        success: function(data) {
            $.fn.zTree.init($("#tree"), setting, data); //同步调用数据
        }
    });
})
*/

var setting = {
    async: {
        enable: true,
        url:"bmap/ztree/getdata/",
        autoParam:["id"],     //点击父节点加载子节点时提交的数据
        //otherParam:{"otherParam":"zTreeAsyncTest"}, //提交的额外参数，包括初始化时也会提交
        dataFilter: filter  //用于对 Ajax 返回数据进行预处理的函数,该函数最终返回zTree支持的json格式数据，附加到父节点下
    },
    check: {
        enable: true
    },
    view: {
        fontCss: {
            //color: "red"
            //fontSize:150%
        }
    },
    edit:{
        enable:true,
        drag:{
            isMove:true,
            inner:false
        }
    },
    callback: {
        onCheck: onCheck,    //选定及取消复选框调用的事件
        onDrop: onDrop,  //用于捕获节点拖拽操作结束的事件回调函数
        onClick: onClick,   //节点被点击触发
        //onClick: onClick
    }
};

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        if (childNodes[i].icon=="default") {
            childNodes[i].icon = "/cable/static/icon/ylw-pushpin.png"
        }
    }
    return childNodes;
}


$("#searchbutton").click(function(){
    if($("#searchinput").val()!=""){
        $("#fm-sidebar").showLoading();
        var param = {'kw':$("#searchinput").val()};
        $.ajax({
            url: "bmap/ztree/search/",
            data: param, //这里是js的字典
            beforeSend: function(xhr, settings) {
                var csrftoken = Cookies.get('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            type: "POST",
            //dataType: "json", //预期服务器返回的数据
            success: function(data) {
                var setting = {
                    data:{
                        simpleData:{
                            enable:true
                        }
                    },
                    check: {
                        enable: true
                    }
                };
                $.fn.zTree.init($("#tree"), setting, data); //同步调用数据
                var treeObj = $.fn.zTree.getZTreeObj("tree");
                treeObj.expandAll(true);
                $("fm-sidebar").hideLoading();
            }
        });
    }
    
})
/*
var setting = {
    check: {
        enable: true
    },
    data: {
        simpleData: { //不需要用户再把数据库中取出的 List 强行转换为复杂的 JSON 嵌套格式
            enable: true
        }
    },
    view: {
        fontCss: {
            color: "red"
        }
    },
    callback: {
        onCheck: onCheck    //选定及取消复选框调用的事件
        //onClick: onClick
    }
};*/


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