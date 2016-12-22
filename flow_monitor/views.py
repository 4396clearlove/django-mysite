#-*- coding:utf8 -*-
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import *
# Create your views here.
import datetime

def main(request):
    return render(request, "flow_monitor/show.html")

def get_top5(request):
    if request.method=='POST':
        date = datetime.date(2016, 12, 16)
        instances = ring_flow_table.objects.filter(date=date).order_by("-down_link_usage")[:5]
        return JsonResponse(
            {
            "usage": [instance.down_link_usage for instance in instances],
            "ring": [instance.name for instance in instances]
            },
            safe=False
        )

def get_usage(request, id):
    if request.method=='POST':
        id = int(id)
        if id>=2 and id<=6:
            date = datetime.date(2016, 12, 16)
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
