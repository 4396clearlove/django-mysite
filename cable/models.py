#-*- coding:utf8 -*-

from django.db import models

class coordinates_table(models.Model):
    Name = models.CharField(u'标识名称', max_length=100)
    Description = models.TextField(u"描述", null=True, blank=True)
    Coordinates = models.TextField(u'坐标集', null=True, blank=True)
    BMPoints = models.TextField(u'百度坐标集',null=True, blank=True)
    StartPoint = models.CharField(u"起点名称", max_length=100, null=True, blank=True)
    EndPoint = models.CharField(u"终点名称", max_length=100, null=True, blank=True)
    Type = models.IntegerField(u"类型")   #0为文件夹，1为折线，2为点
    Level = models.IntegerField(u"树层级", null=True, blank=True) #从0开始
    Icon = models.CharField(u"图标", max_length=20, null=True, blank=True)
    Color = models.CharField(u"图标颜色", max_length=20, null=True, blank=True)
    ParentIdent = models.CharField(u"父节点标识", max_length=30, null=True, blank=True)
    ElementIdent = models.CharField(u"节点唯一标识", max_length=30, primary_key=True)
    IsDelete = models.BooleanField(u"是否移除", default=False)

    class Meta:
    	app_label = 'cable'
