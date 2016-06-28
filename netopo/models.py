#-*- coding:utf8 -*-

from django.db import models
from django.utils import timezone
import ast
from django.utils.encoding import (smart_text, force_text, force_bytes,
    python_2_unicode_compatible)

# Create your models here.
class ring(models.Model):
    name = models.CharField(u'环路名称', max_length=10, primary_key=True)
    topoStruct = models.TextField(u'环路拓扑')
    ringNodeNum = models.IntegerField(u'环路节点数')
    chainNodeNum = models.IntegerField(u'支链节点数')


class hw_ipran_node(models.Model):
    name = models.CharField(u'网元名称', max_length=80)
    ShortName = models.CharField(u'中文全称(包含注解)', max_length=80,null=True)
    StationName = models.CharField(u'所属物理站点', max_length=80)
    ip   = models.CharField(u'IP地址' , max_length=20)
    node_type = models.CharField(u'网元类型', max_length=15)
    isRoot  = models.BooleanField(u'带环点', default=False)
    SelfBusinessAmount = models.IntegerField(u'自身下带业务数', null=True)
    BusinessAmount = models.IntegerField(u'下带业务数', null=True)
    Ring = models.CharField(u'所属环路', max_length=10, null=True)

    def __unicode__(self):
        return self.name
    

class hw_ipran_link(models.Model):
    source = models.CharField(u'源节点', max_length=80,null=True)
    sport  = models.CharField(u'源端口', max_length=30,null=True)
    dest   = models.CharField(u'宿节点', max_length=80,null=True)
    dport  = models.CharField(u'宿端口', max_length=30,null=True)
    ring   = models.CharField(u'所属环路', max_length=10,null=True)


class hw_ipran_business_2G(models.Model):
    StationName = models.CharField(u'站点名称', max_length=80)
    TransStationName = models.CharField(u'传输自编号', max_length=80)
    Node = models.ForeignKey(
                        hw_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'所属节点',
                        null = True,
                        blank = True
    )


class hw_ipran_business_3G_E1(models.Model):
    StationName = models.CharField(u'站点名称', max_length=80)
    TransStationName = models.CharField(u'传输自编号', max_length=80)
    Node = models.ForeignKey(
                        hw_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'所属节点',
                        null = True,
                        blank = True
    )


class hw_ipran_business_3G_FE(models.Model):
    StationName = models.CharField(u'站点名称', max_length=80)
    TransStationName = models.CharField(u'传输自编号', max_length=80)
    Node = models.ForeignKey(
                        hw_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'所属节点',
                        null = True,
                        blank = True
    )


class hw_ipran_business_LTE(models.Model):
    StationName = models.CharField(u'站点名称', max_length=80)
    TransStationName = models.CharField(u'传输自编号', max_length=80)
    Node = models.ForeignKey(
                        hw_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'所属节点',
                        null = True,
                        blank = True
    )


class fh_ipran_node(models.Model):
    NeId = models.IntegerField(u'网元逻辑ID', primary_key=True)
    NeName = models.CharField(u'网元名称', max_length=255)
    ShortName = models.CharField(u'中文全称', max_length=80,null=True)
    Type = models.IntegerField(u'网元类型')
    Ring = models.CharField(u'所属环路', max_length=10, null=True)
    isRoot  = models.BooleanField(u'带环点', default=False)
    SelfBusinessAmount = models.IntegerField(u'自身下带业务数', null=True)
    BusinessAmount = models.IntegerField(u'下带业务数', null=True)

    def __unicode__(self):
        return self.NeName


class fh_ipran_toponode(models.Model):
    TopoNodeId = models.IntegerField(u'网元拓扑ID', primary_key=True)
    Neid = models.ForeignKey(
                        fh_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'网元逻辑ID',
                        null = True,
                        blank = True
                        )

    def __unicode__(self):
        return self.Neid.NeName


class fh_ipran_topolink(models.Model):
    TopoLinkId = models.IntegerField(primary_key=True)
    source = models.CharField(u'源节点', max_length=100)
    dest = models.CharField(u'宿节点', max_length=100)
    Ring = models.CharField(u'所属环路', max_length=10, null=True)


class fh_ipran_business_2G(models.Model):
    StationName = models.CharField(u'站点名称', max_length=80)
    TransStationName = models.CharField(u'传输自编号', max_length=80)
    Node = models.ForeignKey(
                        fh_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'所属节点',
                        null = True,
                        blank = True
    )

class fh_ipran_business_3G_E1(models.Model):
    StationName = models.CharField(u'站点名称', max_length=80)
    TransStationName = models.CharField(u'传输自编号', max_length=80)
    Node = models.ForeignKey(
                        fh_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'所属节点',
                        null = True,
                        blank = True
    )


class fh_ipran_business_3G_FE(models.Model):
    StationName = models.CharField(u'站点名称', max_length=80)
    TransStationName = models.CharField(u'传输自编号', max_length=80)
    Node = models.ForeignKey(
                        fh_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'所属节点',
                        null = True,
                        blank = True
    )


class fh_ipran_business_LTE(models.Model):
    StationName = models.CharField(u'站点名称', max_length=80)
    TransStationName = models.CharField(u'传输自编号', max_length=80)
    Node = models.ForeignKey(
                        fh_ipran_node,
                        on_delete = models.SET_NULL,
                        verbose_name = u'所属节点',
                        null = True,
                        blank = True
    )