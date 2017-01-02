#-*- coding:utf8 -*-
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import Q, F, When, Case
# from django.db import connections
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

def get_usage(request, id):
    if request.method=='POST':
        id = int(id)
        if id>=2 and id<=6:
            # import pdb;pdb.set_trace()
            date = ring_flow_table.objects.only('date').order_by('-date')[:1][0].date
            # ring = ring_flow_table.objects.filter(date=date).order_by("-down_link_usage")[:5][id-2].name
            ring = ring_flow_table.objects.filter(date=date).order_by("-link_usage")[:5][id-2].name
            instances = ring_flow_table.objects.filter(name=ring).order_by("date")[:7]
        else:
            pass

        return JsonResponse(
            {
            # "averageUsage":[instance.down_link_usage if instance.down_link_usage>instance.up_link_usage else instance.up_link_usage  for instance in instances],
            # "peakUsage": [instance.down_link_peak_usage if instance.down_link_peak_usage>instance.up_link_peak_usage else instance.up_link_peak_usage  for instance in instances],
            "averageUsage": [instance.link_usage for instance in instances],
            "peakUsage": [instance.link_peak_usage for instance in instances],
            "ring": ring,
            "date":[instance.date for instance in instances]
            },
            safe=False
        )
