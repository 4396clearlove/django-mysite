$(function(){
    $.fn.zTree.init($("#tree"), setting);
})

$("#searchbutton").click(function(){
    if($("#searchinput").val()!=""){
        var param = {'kw':$("#searchinput").val()};
        $.ajax({
            url: "/ztree/search/",
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
            }
        });
    }
    
})


var setting = {
    async: {
        enable: true,
        url:"/ztree/getdata/",
        autoParam:["pk"],     //点击父节点加载子节点时提交的数据
        //otherParam:{"otherParam":"zTreeAsyncTest"}, //提交的额外参数，包括初始化时也会提交
        //dataFilter: filter  //用于对 Ajax 返回数据进行预处理的函数,该函数最终返回zTree支持的json格式数据，附加到父节点下
    },
    check: {
        enable: true
    },
};

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

/*
$(document).ready(function() {
    //$.fn.zTree.init($("#tree"), setting, zNodes); //同步调用数据
    $.fn.zTree.init($("#tree"), setting);  //异步加载数据
});
*/

function onCheck(e, treeId, treeNode) {
    if(treeNode.isParent){
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        var nodes = treeObj.getNodesByParam("isParent", false, treeNode);   //得到所有level最低的子节点
    }else{
        var nodes = [treeNode];
    }
    
    
    $.each(nodes,function(i){
        flag = nodes[i].checked;
        if(flag){
            //para = {'cableName':nodes[i].name}; //这里是通过名称来查
            para = {'cablePK':nodes[i].pk}; //改为通过键值来查
            addOverlay(para, nodes[i].tId);
        }else{
            removeOverlay(nodes[i].tId);
        }
    });
}