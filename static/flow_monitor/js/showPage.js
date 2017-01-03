$(function(){
    Reveal.initialize({
        center: true,   //垂直方向居中
        controls: false,
        autoSlideStoppable: false,  //全屏也会自动切换
        transition: 'convex',
        progress: false,
        mouseWheel: true,
        loop: true,
        width: "100%",
        height: "100%",
        margin: 0,
        minScale: 1,
        maxScale: 1
    });

    Reveal.addEventListener('slidechanged', function(){
        var index = Reveal.getState()['indexh']+1;
        slideCharts(index);
    });

    initCharts();
});

function initCharts(){
    var chart1_1 = echarts.init(document.getElementById('chart1_1'));
    var chart1_2 = echarts.init(document.getElementById('chart1_2')); 
    var chart1_3 = echarts.init(document.getElementById('chart1_3')); 
    $.ajax({
        url: "/flow_monitor/top5",
        beforeSend:function(xhr,settings){
            var csrftoken = Cookies.get('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken)
        },
        dataType:"json",
        type:"POST",
        success:function(content){
            var option1 = {
                title: {
                    text: '核心环流量TOP 5',
                    left: "50%",
                    textAlign: "center"
                },
                tooltip: {
                    trigger: 'axis'
                },
                // legend: {
                //     data:['带宽利用率'],
                //     orient: "vertical",
                //     right:0,
                //     top: "40%"
                // },
                visualMap: {
                    // type: 'continuous'
                    type: 'piecewise',
                    show: false
                },
                xAxis: {
                    data: content['hring']['ring'],
                    name: '环路名称'
                },
                yAxis:{
                    type: 'value',
                    name: '利用率',
                    min: 0,
                    max: 100,
                    interval: 10,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [{
                    name: '带宽利用率',
                    type: 'bar',
                    data: content['hring']['usage'],
                    markLine: {
                        data: [{
                            name: '预警线',
                            yAxis: 70
                        }]
                    }
                }]
            };
            var option2 = {
                title: {
                    text: '汇聚环流量TOP 5',
                    left: "50%",
                    textAlign: "center"
                },
                tooltip: {
                    trigger: 'axis'
                },
                // legend: {
                //     data:['带宽利用率'],
                //     orient: "vertical",
                //     right:0,
                //     top: "40%"
                // },
                visualMap: {
                    type: 'piecewise',
                    show: false
                },
                xAxis: {
                    data: content['jring']['ring'],
                    name: '环路名称'
                },
                yAxis:{
                    type: 'value',
                    name: '利用率',
                    min: 0,
                    max: 100,
                    interval: 10,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [{
                    name: '带宽利用率',
                    type: 'bar',
                    data: content['jring']['usage'],
                    markLine: {
                        data: [{
                            name: '预警线',
                            yAxis: 70
                        }]
                    }
                }]
            };
            var option3 = {
                title: {
                    text: '接入环流量TOP 5',
                    left: "50%",
                    textAlign: "center"
                },
                tooltip: {
                    trigger: 'axis'
                },
                // legend: {
                //     data:['带宽利用率'],
                //     orient: "vertical",
                //     right:0,
                //     top: "40%"
                // },
                visualMap: {
                    type: 'piecewise',
                    show: false
                },
                xAxis: {
                    data: content['rring']['ring'],
                    name: '环路名称'
                },
                yAxis:{
                    type: 'value',
                    name: '利用率',
                    min: 0,
                    max: 100,
                    interval: 10,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [{
                    name: '带宽利用率',
                    type: 'bar',
                    data: content['rring']['usage'],
                    markLine: {
                        data: [{
                            name: '预警线',
                            yAxis: 70
                        }]
                    }
                }]
            };
            chart1_1.setOption(option1);
            chart1_2.setOption(option2);
            chart1_3.setOption(option3);
        }
    });
}

function slideCharts(index){
    if(index==1){
        initCharts()
        return null
    }
    else if(index==2){
        var data = {
            ringIndex: "H",
            count: 4,
            begin: 0
        }
    }else if(index==3){
        var data = {
            ringIndex: "H",
            count: 4,
            begin: 4
        }
    }else if(index==4){
        var data = {
            ringIndex: "J",
            count: 4,
            begin: 0
        }
    }else if(index==5){
        var data = {
            ringIndex: "J",
            count: 4,
            begin: 4
        }
    }else if(index==6){
        var data = {
            ringIndex: "R",
            count: 4,
            begin: 0
        }
    }
    var charts = [];
    for(var y=1;y<=4; y++){
        charts.push(echarts.init(document.getElementById('chart'+index+'_'+y)));
    }
    $.ajax({
            url: "/flow_monitor/usage",
            beforeSend:function(xhr,settings){
                var csrftoken = Cookies.get('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken)
            },
            dataType:"json",
            data: data,
            type:"POST",
            success:function(contents){
                for(var i=0; i<contents.length; i++){
                    var content = contents[i];
                    var option = {
                        title: {
                            text: content.ring+'最近五天流量',
                            left: "50%",
                            textAlign: "center"
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        // toolbox: {
                        //     feature: {
                        //         dataView: {show: true, readOnly: false},
                        //         magicType: {show: true, type: ['line', 'bar']},
                        //         restore: {show: true},
                        //         saveAsImage: {show: true}
                        //     }
                        // },
                        legend: {
                            orient: "vertical",
                            right:0,
                            top: "0%",
                            data:['平均带宽利用率','峰值带宽利用率']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data:content['date'],
                                name: '日期'
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '利用率',
                                min: 0,
                                max: 100,
                                interval: 10,
                                axisLabel: {
                                    formatter: '{value} %'
                                }
                            }
                        ],
                        series: [
                            {
                                name:'平均带宽利用率',
                                type:'bar',
                                data:content['averageUsage'],
                                markLine: {
                                    data: [{
                                        name: '预警线',
                                        yAxis: 70
                                    }]
                                }
                            },
                            {
                                name:'峰值带宽利用率',
                                type:'bar',
                                barGap: '0%',
                                data:content['peakUsage']
                            }
                        ]
                        };
                    charts[i].setOption(option);
                }
            }
    });
}