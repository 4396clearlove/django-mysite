#-*- coding:utf8 -*-
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
# from django.db import connections
from .models import *
# Create your views here.
import datetime

def main(request):
    return render(request, "flow_monitor/show.html")

def get_top5(request):
    if request.method=='POST':
        # date = datetime.datetime(2016, 12, 13)
        date = ring_flow_table.objects.only('date').order_by('date')[:1][0].date
        # import pdb;pdb.set_trace()
        h_instances = ring_flow_table.objects.filter(Q(name__startswith='H'),date=date).order_by("-down_link_usage")[:5]
        j_instances = ring_flow_table.objects.filter(Q(name__startswith='J'),date=date).order_by("-down_link_usage")[:5]
        r_instances = ring_flow_table.objects.filter(Q(name__startswith='R'),date=date).order_by("-down_link_usage")[:5]
        return JsonResponse(
            {
                "hring":{
                    "usage": [instance.down_link_usage for instance in h_instances],
                    "ring": [instance.name.decode('gbk') for instance in h_instances]
                },
                "jring":{
                    "usage": [instance.down_link_usage for instance in j_instances],
                    "ring": [instance.name.decode('gbk') for instance in j_instances]
                },
                "rring":{
                    "usage": [instance.down_link_usage for instance in r_instances],
                    "ring": [instance.name.decode('gbk') for instance in r_instances]
                }
            },
            safe=False
        )

def get_usage(request, id):
    if request.method=='POST':
        id = int(id)
        if id>=2 and id<=6:
            # date = datetime.date(2016, 12, 13)
            date = ring_flow_table.objects.only('date').order_by('date')[:1][0].date
            ring = ring_flow_table.objects.filter(date=date).order_by("-down_link_usage")[:5][id-2].name
            instances = ring_flow_table.objects.filter(name=ring).order_by("date")
        else:
            pass

        return JsonResponse(
            {
            "averageUsage":[instance.down_link_usage for instance in instances],
            "peakUsage": [instance.down_link_peak_usage for instance in instances],
            "ring": ring,
            "date":[instance.date for instance in instances]
            },
            safe=False
        )
