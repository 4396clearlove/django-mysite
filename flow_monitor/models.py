#-*- coding:utf8 -*-

from django.db import models

# Create your models here.

class ring_flow_table(models.Model):
    name = models.CharField(u"环路名称", max_length=50)
    # down_link_usage = models.FloatField(u"下行均值带宽利用率")
    # down_link_peak_usage = models.FloatField(u"下行峰值带宽利用率")
    # up_link_usage = models.FloatField(u"上行均值带宽利用率")
    # up_link_peak_usage = models.FloatField(u"上行峰值带宽利用率")
    link_usage = models.FloatField(u"下行均值带宽利用率")
    link_peak_usage = models.FloatField(u"下行峰值带宽利用率")
    date = models.DateField(u"日期")

    class Meta:
        db_table = 'Ring_flow'
        app_label = 'flow_monitor'