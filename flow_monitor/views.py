#-*- coding:utf8 -*-
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import Q, F, When, Case
from .models import *
# Create your views here.
import datetime

def main(request):
    return render(request, "flow_monitor/show.html")

def get_top5(request):
    if request.method=='POST':
        date = ring_flow_table.objects.only('date').order_by('-date')[:1][0].date

        # 使用了Case....When...来过滤，别删除
        # d_lt_u = When(down_link_usage__gt=F('up_link_usage'), then='down_link_usage')
        # condition = Case(d_lt_u, default='up_link_usage')
        # h_instances = ring_flow_table.objects.filter(Q(name__startswith='H'),date=date).values('name').annotate(max_link_usage= condition).order_by('-max_link_usage').values_list('name','max_link_usage')[:5]
        # j_instances = ring_flow_table.objects.filter(Q(name__startswith='J'),date=date).values('name').annotate(max_link_usage= condition).order_by('-max_link_usage').values_list('name','max_link_usage')[:5]
        # r_instances = ring_flow_table.objects.filter(Q(name__startswith='R'),date=date).values('name').annotate(max_link_usage= condition).order_by('-max_link_usage').values_list('name','max_link_usage')[:5]
        

        h_instances = ring_flow_table.objects.filter(Q(name__startswith='H'),date=date).order_by("-link_usage").values_list('name','link_usage')[:5]
        j_instances = ring_flow_table.objects.filter(Q(name__startswith='J'),date=date).order_by("-link_usage").values_list('name','link_usage')[:5]
        r_instances = ring_flow_table.objects.filter(Q(name__startswith='R'),date=date).order_by("-link_usage").values_list('name','link_usage')[:5]
        return JsonResponse(
            {
                "hring":{
                    "usage": [i[1] for i in h_instances],
                    "ring": [i[0].decode('gbk') for i in h_instances],
                },
                "jring":{
                    "usage": [i[1] for i in j_instances],
                    "ring": [i[0].decode('gbk') for i in j_instances],
                },
                "rring":{
                    "usage": [i[1] for i in r_instances],
                    "ring": [i[0].decode('gbk') for i in r_instances],
                }
            },
            safe=False
        )

def get_usage(request):
    if request.method=='POST':
            count = int(request.POST['count'])
            ringIndex = request.POST['ringIndex']
            begin = int(request.POST['begin'])

            date = ring_flow_table.objects.only('date').order_by('-date')[:1][0].date

            a = '(select top 8 row_number() over(order by link_usage desc) as row_number,* from Ring_flow where date in (select max(date) from Ring_flow) and name like \'%s%%\') as A' % (ringIndex+"%")
            b = '(select top %d name, row_number from %s where row_number not in (select top %d row_number from %s)) as B' % (count, a, begin, a)

            sql = 'select * from Ring_flow as C inner join %s on C.name=B.name where date in (select distinct top 5 date from Ring_flow order by date desc) order by row_number, date' % b
            instances = ring_flow_table.objects.raw(sql)

            # instances = zip(*instances)

            tmp_name = None
            out_list = []
            out_dict = {}                
            for instance in instances:
                if tmp_name is None:
                    out_dict.setdefault("ring", (instance.name).decode('gbk'));
                    out_dict.setdefault("averageUsage",[]).append(instance.link_usage)
                    out_dict.setdefault("peakUsage",[]).append(instance.link_peak_usage)
                    out_dict.setdefault("date",[]).append(instance.date)
                    tmp_name = instance.name
                    continue
                if instance.name!=tmp_name:
                    if out_dict != {}:
                        out_list.append(out_dict)
                        out_dict = {}
                    out_dict.setdefault("ring", (instance.name).decode('gbk'));
                    out_dict.setdefault("averageUsage",[]).append(instance.link_usage)
                    out_dict.setdefault("peakUsage",[]).append(instance.link_peak_usage)
                    out_dict.setdefault("date",[]).append(instance.date)
                    tmp_name = instance.name
                else:
                    out_dict.setdefault("averageUsage",[]).append(instance.link_usage)
                    out_dict.setdefault("peakUsage",[]).append(instance.link_peak_usage)
                    out_dict.setdefault("date",[]).append(instance.date)

            out_list.append(out_dict)

    # import pdb;pdb.set_trace()
    return JsonResponse(out_list, safe=False)
