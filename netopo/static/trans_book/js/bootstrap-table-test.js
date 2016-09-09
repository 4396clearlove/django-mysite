$(function () {

    //展开高级搜索框
    $('#searchBoxOpenButton').click(function () {
        $("#advancedSearchBox").css('display','block');
        $("#searchBoxCloseButton").css('display','inline-block');
        $("#searchBoxOpenButton").css('display','none');
    });

    //收起高级搜索框
    $('#searchBoxCloseButton').click(function () {
        $("#advancedSearchBox").css('display','none');
        $("#searchBoxCloseButton").css('display','none');
        $("#searchBoxOpenButton").css('display','inline-block');
    });

    //表单查询事件
    $("#IndexForm").submit(function(){
        var param = $('#InputBox').val();
        var type = $('#TypeSelect option:selected').val();
        if(type=='01'){         //01代表的是网元名
            var dataPara = {'station_name':param};
            $.ajax({
                url:"/netopo/search_by_name/",
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

    //节点展示表格
    $('#NodeTable').bootstrapTable({
        height: document.body.clientHeight-80,
        detailView: true,   //展开子表
        url: "/netopo/bootstrap_table/data",
        toolbar: "#toolbar",
        toolbarAlign: 'right',
        pagination: true,
        sidePagination: 'server',
        sortName: 'bnum',
        sortOrder: 'desc',
        // filterControl: true,
        search: true,
        // advancedSearch: true,
        // idTable: 'advancedTable',
        // searchOnEnterKey: true,
        // showFilter: true,
        pageList:"[5, 10, 20, 50, 100, 200]",
        locale: "zh-cn",
        columns: [{
            field:'id',
            title:'序号'
        },{
            field:'station',
            // filterControl:"input",
            title:"传输网元",
            align:"center", //列名对齐方式
            formatter:StationFormatter
        },{
            field:'bnum',
            sortable:true,
            title:"逻辑站点数"
        }],
        onExpandRow: function(index, row, $detail){
            initSubTable(index, row, $detail); //生成子表
            generateEchartRing(row, true);  //生成环路图
        },
        onClickRow: function(row, $element, field){ //点击行实现展开与收缩，参考行前的标记实现的。
            var index = $element.data()['index'];
            if($element.next().is('tr.detail-view')){   //通过这句来判断是否已经展开
                $("#NodeTable").bootstrapTable('collapseRow',index);
                // $element.next().remove();
                // $element.find('i').attr('class',"glyphicon glyphicon-plus icon-plus");
            } else {
                $("#NodeTable").bootstrapTable('expandRow',index);
            }
        },
        onCollapseRow: function(index, row){
            echarts.dispose(myChart);
        },
        formatShowingRows: function(pageFrom, pageTo, totalRows){
            return ['总共 ',totalRows,' 条'].join("")
        },
        formatRecordsPerPage: function(pageNumber){
            return pageNumber
        }
    });

    //提交toolbar，必须得submit form才能不刷新
    $("#toolbar-form").submit(function(){
        $("#content").showLoading();
        var dataPara = getFormJson(this);
        //var formData = new FormData($("#index-form")[0]); //使用FormData来上传文件，[0]必须加上
        $.ajax({
        url:"/netopo/exceeded-node/",
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

    //上传文件 ToDo
    $("#upload-excel").submit(function(){
        var formData = new FormData($("#upload-excel")[0]); //使用FormData来上传文件，[0]必须加上
        $.ajax({
            url:"/netopo/analysis_excel/",
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

    //content2 left table
    $('#C2LeftT1').bootstrapTable({
        height: document.body.clientHeight-151,
        toolbar: "#C2LeftT1Toolbar",    //有了toolbar就不是特别好计算高度了
        columns: [{
            field:'id',
            title:'序号'
        },{
            field:'phyStation',
            title:'物理站点'
        }],
    });

    //content2 right table
    $('#C2RightT1').bootstrapTable({
        columns: [
        {
            field:'Ring',
            title:'所属环路'
        },{
            field:'StationName',
            title:'物理站点'
        },{
            field:'name',
            title:'传输网元'
        },{
            field:'ringNodeNum',
            title:'环路节点数'
        },{
            field:'chainNodeNum',
            title:'支链节点数'
        }],
    });


    $("#C2AppendBtn").click(function(){
        $('#C2LeftT1').bootstrapTable('append',[{id:1,phyStation:'新德政中'},{id:2,phyStation:'鸦岗八方物流'},{id:3,phyStation:'东升石矿'},{id:4,phyStation:'岑村牌坊'},{id:5,phyStation:'白云永泰'},{id:6,phyStation:'白云东平'}]);
    });


    $("#C2AnalysisBtn").click(function(){
        var content = $('#C2LeftT1').bootstrapTable('getData');
        var data=[];

        $.each(content, function(i){
            //console.log(content[i]['phyStation']);
            if($.inArray(content[i]['phyStation'], data)==-1){
                data.push(content[i]['phyStation']);
            }   //$.inArray为-1则表示没有找到该元素
        });

        //var data = {phyStation:content[0]['phyStation']};

        $.ajax({
            url:"/netopo/search_by_phystation/",
            type:"POST",
            data:{phyStation:JSON.stringify(data)},
            beforeSend:function(xhr,settings){
                var csrftoken = Cookies.get('csrftoken');
                //console.log('before send');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            dataType:'json',
            success:function(returndata){
                //对返回的内容根据环路名及物理站名进行排序
                var sortedArray = returndata.sort(function(x,y){
                    return (x['Ring']==y['Ring'])?(x['StationName'].localeCompare(y['StationName'])):(x['Ring'].localeCompare(y['Ring']))
                });

                //对行列相同的内容进行合并
                var rowspan=1;
                var res=[];
                for(var i=1;i<sortedArray.length;i++){
                    if(sortedArray[i]['Ring']==sortedArray[i-1]['Ring']){
                        rowspan++;
                    }else{
                        res.push({field:"Ring",index:i-rowspan,rowspan:rowspan,colspan:1});
                        rowspan=1;
                    }
                }
                res.push({field:"Ring",index:i-rowspan,rowspan:rowspan,colspan:1});

                //对物理站名列的内容进行合并
                rowspan=1;
                for(var i=1;i<sortedArray.length;i++){
                    if(sortedArray[i]['Ring']==sortedArray[i-1]['Ring'] && sortedArray[i]['StationName']==sortedArray[i-1]['StationName']){
                        rowspan++;
                    }else{
                        res.push({field:"StationName",index:i-rowspan,rowspan:rowspan,colspan:1});
                        rowspan=1;
                    }
                }
                res.push({field:"StationName",index:i-rowspan,rowspan:rowspan,colspan:1});

                $('#C2RightT1').bootstrapTable('load', sortedArray);
                $.each(res,function(i){
                    if(res[i]['rowSpan']!=1){
                        $('#C2RightT1').bootstrapTable('mergeCells',res[i]);
                    }
                });
            },
            error:function(returndata){
                alert('分析失败！');
            },
        });
    });


    $("#C2Modal1UploadForm").submit(function(){
        //$('#C2Modal1').modal('hide');   //关闭摸态框
        //$("#C2LeftT1").showLoading();   //ToDo，不知道为什么无效
        
        var formData = new FormData($("#C2Modal1UploadForm")[0]); //使用FormData来上传文件，[0]必须加上
        $(".modal-content").showLoading();
        $.ajax({
            url:"/netopo/analysis_excel/",
            type:"POST",
            data:formData,
            dataType:'json',
            beforeSend:function(xhr,settings){
                var csrftoken = Cookies.get('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            async:false,
            cache:false,
            contentType:false,
            processData:false,
            success:function(returndata){
                
                //$('#C2Modal1').modal('hide');   //关闭摸态框
                var data = [];
                for(var i=0;i<returndata.length;i++){
                    data.push({id:i+1,phyStation:returndata[i]})
                }
                $(".modal-content").hideLoading();
                $('#C2Modal1').modal('hide');
                $('#C2LeftT1').bootstrapTable('load',data);
                
            },
            error:function(returndata){
                alert("无法获取excel数据！");
                $(".modal-content").hideLoading();
                $('#C2Modal1').modal('hide');
            },
        });
        return false;   //一定得false才不会刷新页面
    });

});

//生成子表
initSubTable = function (index, row, $detail) {
    //var parentid = row.MENU_ID;
    var cur_table = $detail.html('<table></table>').find('table');
    var type = row.station.type;
    var pk = row.station.pk;

    $(cur_table).bootstrapTable({
        url: "/netopo/"+type+"/"+pk+"/",
        method: 'get',
        dataType:'json',
        clickToSelect: true,
        uniqueId: "MENU_ID",
        columns: [
        {
            field: 'id',
            title: '序号'
        }, {
            field: 'station',
            title: '站点名称'
        }, {
            field: 'node',
            title: '所属网元'
        }, {
            field: 'ring',
            title: '所属环路'
        }]
    });
};

//往表格中添加选中的站点，type为hw_ipran、fh_sdh..
generateEchartRing = function (row, refresh){
    if(refresh){
        var ring = row.station.ring;  //通过这样来更新环路
        var type = row.station.type;
        $.ajax({    //通过ajax嵌套来再获取环路拓扑图
            url:"",
            data:{'ring':ring, "type":type},
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

//生成环路echart图
function generate_ring_echart(data){
    //定义echarts全局变量
    myChart = echarts.init(document.getElementById('ring-graph'));
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
            text: data.graph.ring+"环",
            subtext: "环路节点数(不包含带环点):"+data.graph.CycleNodeNum+'\n支链节点数:'+data.graph.ChainNodeNum,
            //top: 'bottom',
            //left: 'right'
        },

        tooltip: {      //浮动提示框，这里是通过调用的方式来获取后端数据
            formatter: function(params, ticket, callback) {
                if (params.data.type=='root'){
                    return "带环点："+params.name
                }
                else {
                    return params.name+'<br/>下挂节点数:'+params.data.Nnode+'<br/>下带逻辑站点数:'+params.data.Nbusiness
                }
            },
            transitionDuration: 0
            //triggerOn: 'mouseover',   //可选，触发类型
            //enterable: true,
            //alwaysShowContent: false,
            // show: false,
            // formatter: function(param, ticket, callback){
            //     var dataPara = {};
            //     //dataPara['links']    = JSON.stringify(data.links); //这里data是一个全局变量，data.links是一个列表，必须得转为json才能传过去
            //     dataPara['name']     = param.name;
            //     dataPara['ring']     = data.graph.ring;

            //     $.ajax({
            //         url:"/statistic/",
            //         beforeSend:function(xhr,settings){
            //             var csrftoken = Cookies.get('csrftoken');
            //             xhr.setRequestHeader("X-CSRFToken", csrftoken);
            //         },
            //         data:dataPara,  //这里是js的字典
            //         dataType:"json",
            //         type:"POST",
            //         success:function(content){
            //             //callback(ticket, "<a href='javascript:append_table()'>"+content['NodeName']+"</a>"+'<br/>下带节点数:'+content['Nnode']+'<br/>下带业务数:'+content['Nbusiness']);
            //             callback(ticket,"<a href='javascript:append_table(\"{0}\",\"{1}\",false)'>{2}</a><br/>下带节点数:{3}<br/>下带业务数:{4}".format(data.graph.EquipmentType,content['pk'],content['NodeName'],content['Nnode'],content['Nbusiness']));
            //         }

            //     });
            //     return 'Loading';
            // }
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
                normal: {
                    width: 3
                },
                emphasis: {
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10,
                    width: 4
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
                repulsion: 1000,
                edgeLength: 80
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

    // var myChart = echarts.init(document.getElementById('ring-graph'));

    myChart.setOption(option);

    // myChart.on('click', function(param){
    //     console.log(param);
    // });
}

//用于格式化NodeTable中的单元格，显示为链接地址
function StationFormatter(value){   //value = {'name':str,'pk':int, 'type':str} 
    if(value.type=="hw_ipran"){
        var type="华为分组"
    }
    else if(value.type=="fh_ipran"){
        var type="烽火分组"
    }
    var o = [
    //'<button class="btn btn-primary" type="button">',
    value.name,
    '<span class="label label-info">',
    type,
    '</span>'
    ]
    return o.join("")
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

//格式化字符串的函数
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