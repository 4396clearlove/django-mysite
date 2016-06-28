$(function () {
    $('#FormSubmitBtn').click(function(){
        var param = $('#InputBox').val();
        var type = $('#TypeSelect option:selected').val();
        if(type=='01'){         //01代表的是网元名
            var dataPara = {'station_name':param};
            $.ajax({
                url:"/tzquery/search_by_name/",
                data:dataPara,  //这里是js的字典
                beforeSend:function(xhr,settings){
                    var csrftoken = Cookies.get('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                },
                type:"POST",
                dataType:"json",    //预期服务器返回的数据
                success:function(data){
                    var html = "";
                    $.each(data, function(i) {
                        var type = i;
                        var NodeDict = data[i];
                        $.each(NodeDict,function(x){
                            //html = html.concat('<div><a href=\"javascript:append_table(\'',type,'\',',x,',true)">',NodeDict[x],'---',type,'</a>');
                            html = html+"<div><a href='javascript:append_table(\"{0}\",\"{1}\",{2})'>{3}</a></div>".format(type,x,true,NodeDict[x]);
                        });
                        
                    });
                    $("#list-similar-station").html(html);},
            });
        }
        else if(type=='02'){                      //02代表的是环路名
            var dataPara = {'ring':param};
            $.ajax({
                url:"", //指调用函数页面的网址
                data:dataPara,
                beforeSend:function(xhr,settings){
                    var csrftoken = Cookies.get('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                },
                type:"POST",
                dataType:"json",    //预期服务器返回的数据
                success:generate_ring_echart    //调用函数生成echart图形展示
                });
        }
    });

    $('#IndexTable').bootstrapTable({
        classes: "table table-hover table-condensed table-bordered",    //table-bordered加上网格，table-condensed紧密
        //pagination: true,   //是否分页
        pageSize: 10,
        //showColumns:true,
        height:450,
        //showRefresh:true,
        //toolbar:"#toolbar",
        //showPaginationSwitch:true,
        //minimumCountColumns:2,  //选择列的下拉单，不能所有列都不显示，最少2列
        //detailView:true,    //有加号展开
        //buttonsAlign:"left",
        //toolbarAlign:"right"
    });
    /*
    $('#NodeTable').bootstrapTable({
        method : 'GET',
        cache: false,
        striped: true,
        pagination: true,
        pageList: [10,20],
        pageSize:10,
        pageNumber:1,
        search: true,
        sidePagination:'server',//设置为服务器端分页
        queryParams: NodeTableQueryParams,//函数，返回参数
        showColumns: true,
        showRefresh: true,
        minimumCountColumns: 2,
        clickToSelect: true,
        smartDisplay:true,
    });*/
    /*
    $('#table').bootstrapTable({
        //data: data,
        classes: "table table-hover table-condensed table-bordered",	//table-bordered加上网格，table-condensed紧密
        //pagination:true,
        pageSize:5,
        //striped:true,
        //height:350,
        //height:460,
        //search:true,
        //showFooter:true,
        showColumns:true,
        showRefresh:true,
        toolbar:"#toolbar",
        //showToggle:true,
        showPaginationSwitch:true,
        minimumCountColumns:2,	//选择列的下拉单，不能所有列都不显示，最少2列
        //cardView:true,
        detailView:true,	//有加号展开
        detailFormatter:"detailFormatter",
        //searchAlign:"left",
        buttonsAlign:"left",
        toolbarAlign:"right",
        toolbar:"#toolbar",
        //paginationDetailHAlign:"right",	//当前第几页，放在右边
        //clickToSelect:true,
    });
    //$('#table').bootstrapTable('reset');
    //$('#table').bootstrapTable('resetView');	//重置表格
    //$('#table').bootstrapTable('getOptions');
    //$('#table').hideLoading();
    //$('#table').bootstrapTable('mergeCells',{   //单元格合并
    //	index:1,
    //	field:'node-down',
    //	colspan:0,
    //	rowspan:3
    //});
*/
    $("#toolbar-button").click(function () {
            var ids = $.map($("#table").bootstrapTable('getSelections'), function (row) {
                return row["station-name"];
            });
            $("#table").bootstrapTable('remove', {
                field: 'station-name',
                values: ids
            });
            $("#toolbar-button").prop('disabled', true);
        });

    $('#table').on('check.bs.table uncheck.bs.table ' +
                'check-all.bs.table uncheck-all.bs.table', function () {
            $("#toolbar-button").prop('disabled', !$('#table').bootstrapTable('getSelections').length);
        });


    $(window).resize(function () {
            $('#table').bootstrapTable('resetView', {
                height: getHeight()
            });
        });


    $("#toolbar-form").submit(function(){     //提交toolbar，必须得submit form才能不刷新
        $("#content").showLoading();
        var dataPara = getFormJson(this);
        //var formData = new FormData($("#index-form")[0]); //使用FormData来上传文件，[0]必须加上
        $.ajax({
        url:"/exceeded-node/",
        data:dataPara,  //这里是js字典
        beforeSend:function(xhr,settings){
            var csrftoken = Cookies.get('csrftoken');
            //console.log('before send');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            //xhr.setRequestHeader("enctype", "multipart/form-data");   //是为了上传文件而设置的，错了，这得在form标签中使用的
        },
        type:"POST",
        dataType:"json",    //预期服务器返回的数据
        success:function(data){
            //data = handle_json(data);   
            //$("#list-similar-station").html(data);
            //alert(data);
            $("#NodeTable").bootstrapTable('removeAll');
            // $.each(data, function(i){
            //     $("#NodeTable").bootstrapTable('append',data[i]);
            // });
            $("#NodeTable").bootstrapTable('append',data);  //批量添加数据，不再一行行地添加
            $("#content").hideLoading();
            },
        });
        return false;   //一定得false才不会刷新页面
    });


    $("#IndexForm").submit(function(){
        var param = $('#InputBox').val();
        var type = $('#TypeSelect option:selected').val();
        if(type=='01'){         //01代表的是网元名
            var dataPara = {'station_name':param};
            $.ajax({
                url:"/tzquery/search_by_name/",
                data:dataPara,  //这里是js的字典
                beforeSend:function(xhr,settings){
                    var csrftoken = Cookies.get('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                },
                type:"POST",
                dataType:"json",    //预期服务器返回的数据
                success:function(data){     //[{'id':int,'station':obj1,'bnum':int}..]; obj1={'name':str,'type':str, 'pk':int}
                    //var html = "";
                    $("#NodeTable").bootstrapTable('removeAll');
                    /*
                    $.each(data, function(i){
                        var type = i;   //节点类型，华为分组、烽火SDH
                        var NodeDictList = data[i];
                        $("#NodeTable").bootstrapTable('append',NodeDictList);
                    });*/
                    $("#NodeTable").bootstrapTable('append',data);
                    /*$.each(data, function(i) {
                        var type = i;
                        var NodeDict = data[i];
                        $.each(NodeDict,function(x){
                            //html = html.concat('<div><a href=\"javascript:append_table(\'',type,'\',',x,',true)">',NodeDict[x],'---',type,'</a>');
                            html = html+"<div><a href='javascript:append_table(\"{0}\",\"{1}\",{2})'>{3}</a></div>".format(type,x,true,NodeDict[x]);
                        });
                        
                    });*/
                    //$("#list-similar-station").html(html);
                },
            });
        }
        else if(type=='02'){                      //02代表的是环路名
            var dataPara = {'ring':param};
            $.ajax({
                url:"", //指调用函数页面的网址
                data:dataPara,
                beforeSend:function(xhr,settings){
                    var csrftoken = Cookies.get('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                },
                type:"POST",
                dataType:"json",    //预期服务器返回的数据
                success:generate_ring_echart    //调用函数生成echart图形展示
                });
        }
        return false;   //一定得false才不会刷新页面
    });


    $("#index-form").submit(function(){     //必须得submit form才能不刷新
                
        //var dataPara = getFormJson(this);
        var dataPara = {};

        var radio = $("#index-form").find("[name='radio']:checked")[0].value;
        var station_name = $("#index-form").find("#station_name")[0].value;
        var ring = $("#index-form").find("#ring")[0].value;
        var excel = $("#index-form").find("#import_excel_analysis")[0];    //加上.files[0]就是一个文件对象了

        switch(radio)
        {
            case "station_name":
                dataPara['station_name'] = station_name
                $.ajax({
                    url:"/tzquery/search_by_name/",
                    data:dataPara,  //这里是js的字典
                    beforeSend:function(xhr,settings){
                        var csrftoken = Cookies.get('csrftoken');
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    type:"POST",
                    dataType:"json",    //预期服务器返回的数据
                    success:function(data){
                        var html = "";
                        $.each(data, function(i) {
                            html = html.concat('<div><a href="javascript:append_table(',i,')">',data[i],'</a>');
                        });
                        $("#list-similar-station").html(html);},
                });
                break;

            case "ring":
                dataPara['ring'] = ring;
                $.ajax({
                    url:"/ipran_ring/",
                    data:dataPara,  //这里是js的字典
                    beforeSend:function(xhr,settings){
                        var csrftoken = Cookies.get('csrftoken');
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    type:"POST",
                    dataType:"json",    //预期服务器返回的数据
                    success:generate_ring_echart,   //调用函数生成echart图形展示
                });
                break;

            case "import_excel": //<form>标签添加enctype="multipart/form-data"属性。
                var formData = new FormData(); //使用FormData来上传文件
                formData.append('excel_file', excel.files[0])
                $.ajax({
                    url:"/tzquery/analysis_excel/",
                    type:"POST",
                    data:formData,
                    beforeSend:function(xhr,settings){
                        var csrftoken = Cookies.get('csrftoken');
                        console.log('before send');
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    async:false,
                    cache:false,    //cache设置为false，上传文件不需要缓存。
                    contentType:false,  //contentType设置为false。因为是由<form>表单构造的FormData对象，且已经声明了属性enctype="multipart/form-data"，所以这里设置为false
                    processData:false,  //因为data值是FormData对象，不需要对数据做处理
                    success:function(returndata){
                        alert(returndata);
                    },
                    error:function(returndata){
                        alert(returndata);
                    },
                });
                break;
        }
        return false;   //一定得false才不会刷新页面
    });



    $("#upload-excel").submit(function(){
        var formData = new FormData($("#upload-excel")[0]); //使用FormData来上传文件，[0]必须加上
        $.ajax({
            url:"/tzquery/analysis_excel/",
            type:"POST",
            data:formData,
            beforeSend:function(xhr,settings){
                var csrftoken = Cookies.get('csrftoken');
                console.log('before send');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            async:false,
            cache:false,
            contentType:false,
            processData:false,
            success:function(returndata){
                alert(returndata);
            },
            error:function(returndata){
                alert(returndata);
            },
        });
        return false;   //一定得false才不会刷新页面
    });



    

});


function node_down_list(value) {
    // 16777215 == ffffff in decimal
    var content = '<select class="form-control" style="width:90%;display:inline-block">';

    $.each(value, function(i){
        var x = value[i];
        $.each(x,function(y){
            content = content.concat('<option>', x[y],'</option>');
        });
        
    });
    content = content.concat('</select>','<span class="badge" style="width:10%">',value.length,'</span>');

    //var content = '<select class="form-control"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>'
    return content;
}

function business_down_list(value){
    var content = '<select class="form-control" style="width:80%;display:inline-block">';

    $.each(value, function(i){
        content = content.concat('<option>', value[i],'</option>');
    });
    //var content = '<select class="form-control"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>'
    content = content.concat('</select>','<span class="badge" style="width:20%">',value.length,'</span>');
    return content;
}



/*
function detailFormatter(index, row) {
    var html = [];

    html.push('<p><b>站点名称:</b> ' + row['station-name'] + '</p>');

    var str = "";
    $.each(row['node-down'], function(i){
        var x = row['node-down'][i];
        $.each(x,function(y){
            str = str.concat(x[y],',');
        });
    });
    str = str.substring(0,str.length-1);

    html.push('<p><b>下挂站点:</b> ' + str + '</p>');
    html.push('<p><b>下带业务:</b> ' + row['business-down'] + '</p>');
    html.push('<p><b>所属环路:</b> ' + row['ring'] + '</p>');
    return html.join('');
}
*/
/*
function getHeight() {
    return $(window).height() - $('.alert alert-success alert-dismissable').outerHeight(true);
}
*/

function getFormJson(frm){
    var o ={};
    var a = $(frm).serializeArray();
    $.each(a, function(){
        if(o[this.name]!==undefined){
            if (!o[this.name].push){
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
    } else {
        o[this.name] = this.value || '';
    }
    });
    return o;
}

function handle_json(data){
    //data = JSON.parse(data);
    var html = "";
    $.each(data, function(i) {
        //alert(data[i]);
        //alert(i);
        //html = html+ "<div><a href=tzquery/"+i+">"+data[i]+"</a></div>"
        //html = html.concat("<div><a target=\"_blank\" href=\"tzquery/",i,"\/\">",data[i],"</a>");
        html = html.concat('<div><a href="javascript:append_table(',i,')">',data[i],'</a>');
    });
    return html;
}


function generate_ring_echart(data){    //生成环路echart图
    var nodes = data.nodes;

    $.each(nodes, function(i){
        if(nodes[i].type=='root'){      //通过type来区分是否带环点，这里的type值是在后端构造的
            nodes[i]['symbolSize'] = 23;
            nodes[i]['category'] = 0;
        }
        else{
            nodes[i]['symbolSize'] = 20;
            nodes[i]['category'] = 1;
        }
        nodes[i]['draggable'] = true;
        nodes[i]['label'] = {
                            normal: {
                                show:true,
                                formatter:nodes[i].name,
                                position:'bottom'
                            },
                            emphasis: {
                                show:true,
                                formatter:nodes[i].name,
                                position: 'bottom',
                                textStyle: {
                                    fontWeight: 'bold'
                                }
                            }
                        }
    });

    option = {
        title: {
            text: data.graph.ring+"环"
        },

        tooltip: {      //浮动提示框，这里是通过调用的方式来获取后端数据
            triggerOn: 'click',
            enterable: true,

            formatter: function(param, ticket, callback){
                var dataPara = {};
                //dataPara['links']    = JSON.stringify(data.links); //这里data是一个全局变量，data.links是一个列表，必须得转为json才能传过去
                dataPara['name']     = param.name;
                dataPara['ring']     = data.graph.ring;

                $.ajax({
                    url:"/statistic/",
                    beforeSend:function(xhr,settings){
                        var csrftoken = Cookies.get('csrftoken');
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    data:dataPara,  //这里是js的字典
                    dataType:"json",
                    type:"POST",
                    success:function(content){
                        //callback(ticket, "<a href='javascript:append_table()'>"+content['NodeName']+"</a>"+'<br/>下带节点数:'+content['Nnode']+'<br/>下带业务数:'+content['Nbusiness']);
                        callback(ticket,"<a href='javascript:append_table(\"{0}\",\"{1}\",false)'>{2}</a><br/>下带节点数:{3}<br/>下带业务数:{4}".format(data.graph.EquipmentType,content['pk'],content['NodeName'],content['Nnode'],content['Nbusiness']));
                    }

                });
                return 'Loading';
            }
        },

        //color: ['#2cb53c'], //必须是列表
        legend: [{
            // selectedMode: 'single',
            data: ['带环点','环路节点']
            
        }],
        
        series: [{
            //color: ['#2cb53c'],
            
            type: 'graph',
            layout: 'force',
            roam: true,
            //默认false，鼠标拖动与缩放。
            symbol: 'roundRect',
            //节点图形
            
            itemStyle: {
                emphasis: {
                    //corlor: '#2cb53c',
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10
                }
            },
            //节点显示，分为normal与emphasis两种状态
            lineStyle: {
                emphasis: {
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10
                }
            },
            //线条的显示，也一样分为normal与emphasis两种状态

            animation: true,    //开启动画，默认开启
            
            //left: (idx % 4) * 25 + '%', 
            //组件离容器左侧的距离。
            //top: Math.floor(idx / 4) * 25 + '%',
            width: '20%',
            height: '20%',
            force: {
                // initLayout: 'circular'
                // gravity: 0
                repulsion: 600,
                edgeLength: 20
            },
            //力引导布局相关的配置项，力引导布局是模拟弹簧电荷模型在每两个节点之间添加一个斥力，每条边的两个节点之间添加一个引力，每次迭代节点会在各个斥力和引力的作用下移动位置，多次迭代后节点会静止在一个受力平衡的位置，达到整个模型的能量最小化。

            data: data.nodes,
            edges: data.links,
            //data: [{'id':2,'name':'test1'},{'id':3,'name':'test2'}],
            //edges:[{'source':2,'target':3}],
            //重要！节点关系，同links,源宿为data中的name值
            categories:     //放置在Series中的
            [
                {
                    name: '带环点',
                    //symbol: 'pin',  //不清楚设置为什么无效
                    //symbolSize: 18, //不清楚设置为什么无效
                    itemStyle: {
                        normal: {
                            color: '#00F5FF'
                        }
                    }
                },
                {
                    name: '环路节点',
                    //symbolSize: 28, //不清楚设置为什么无效
                    itemStyle: {
                        normal: {
                            color: '#2cb53c'
                        }
                    }
                }
            ],
        }]
    }

    var myChart = echarts.init(document.getElementById('ring-graph'));

    myChart.setOption(option);

    //myChart.on('click', event_test);
}

function append_table(type,station_pk,refresh){      //往表格中添加选中的站点，type为hw_ipran、fh_sdh..
    //$("#content").showLoading();
    $.ajax({
        url: "/tzquery/"+type+"/"+station_pk+"/",
        type:"GET",
        dataType:'json',
        success:function(data){
            $("#IndexTable").bootstrapTable('removeAll');
            $("#IndexTable").bootstrapTable('append',data.BusinessList);
            if(refresh){
                var ring = data.ring  //通过这样来更新环路
                $.ajax({    //通过ajax嵌套来再获取环路拓扑图
                    url:"",
                    data:{'ring':ring},
                    beforeSend:function(xhr,settings){
                        var csrftoken = Cookies.get('csrftoken');
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    type:"POST",
                    dataType:"json",    //预期服务器返回的数据
                    success:generate_ring_echart    //调用函数生成echart图形展示
                });
            }          
        }
    });    
}


//用于格式化NodeTable中的单元格，显示为链接地址
function StationFormatter(value){   //value = {'name':str,'pk':int, 'type':str}
    var o = "<a href='javascript:append_table(\"{0}\",\"{1}\",true)'>{2}</a>".format(value.type,value.pk,value.name);
    return o
}


String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}