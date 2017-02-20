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
    sport  = models.CharField(u'源端口', max_length=30,null=True, blank=True)
    dest   = models.CharField(u'宿节点', max_length=80,null=True)
    dport  = models.CharField(u'宿端口', max_length=30,null=True, blank=True)
    ring   = models.CharField(u'所属环路', max_length=10,null=True)
    isDelete = models.BooleanField(u'是否移除', default=False)

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



def updateNodeBusinessAmountByRing(ringName):
    import networkx as nx
    import copy
    import json
    import re
    from django.db.models import Q, F

    linkList = hw_ipran_link.objects.filter(Q(ring=ringName)&Q(isDelete=False)).values_list('source','dest')
    # 'ValuesListQuerySet' object has no attribute 'extend'，所以得转为list
    linkList = list(linkList)

    nodeTuple = reduce(lambda x,y:x+y, linkList)     #[(1,2),(2,3)]-->(1,2,2,3)
    nodeTuple = tuple(set(nodeTuple))  #(1,2,2,3)-->{1,2,3}-->(1,2,3)
    rootNodeTuple = tuple(a for a in nodeTuple if re.search(r'J\d{3,4}',a))  #过滤带环节点，不加tuple是一个生成器，无法计算长度
    rootLinkList = zip(*[iter(rootNodeTuple[i:]) for i in range(2)])   #(1,2,3,4)-->[(1,2),(2,3),(3,4)]    (1,)-->[]   ()-->[]

    if len(rootNodeTuple)==0 or len(rootNodeTuple)>2:
        #ToDo:raise error
        print u"{0}环带环点大于2或等于0"
        # return None
    
    linkList.extend(rootLinkList)

    G = nx.Graph()
    G.add_edges_from(linkList)
    
    try:
        CycleNode = nx.cycle_basis(G)[0]    #环的所有节点
        CycleNodeNum = len(CycleNode)-len(rootNodeTuple)
        ChainNodeNum = len(nodeTuple)-len(CycleNode)
    except:
        CycleNode = []    #无法生成环，则设环为空列表
        CycleNodeNum = 0
        ChainNodeNum = len(nodeTuple)-len(rootNodeTuple)

    ring.objects.update_or_create(
        name        = ringName,
        defaults    = { 'topoStruct':json.dumps(linkList, ensure_ascii=False),  #这样才是显示中文
                        'ringNodeNum':CycleNodeNum,
                        'chainNodeNum':ChainNodeNum }
        )

    for NodeName in nodeTuple:
        I = G.copy()   #得用一个临时变量来存G，不然每次循环都会改变G(G是不会改变的)，得用copy
        CycleNodeCopy = copy.deepcopy(CycleNode)    #得复制列表，不然remove会改变主列表情况
        if NodeName in rootNodeTuple:    #如果节点为带环节点，则跳出本次循环
            continue
        elif NodeName in CycleNodeCopy:    #如果想要查询的节点为环上节点，则移除其它环节点(不包括支链节点)
            CycleNodeCopy.remove(NodeName)
            I.remove_nodes_from(CycleNodeCopy)
        else:    #如果想要查询的节点不为环上节点，则计算带环节点至该节点的最短路径经过的节点，并移除。
            try:
                ShortestNode = nx.dijkstra_path(I,rootNodeTuple[0],NodeName)
            except:
                print u'无法计算环路节点{0}至带环点的最短路径，可能带环点有误'.format(NodeName)
                continue
            ShortestNode.remove(NodeName)
            I.remove_nodes_from(ShortestNode)

        H = nx.dfs_tree(I,NodeName) #最后即可通过生成树协议获得节点及其所下带的节点
        TreeNodeList = H.nodes()   #最终得到所有下带节点
        #TreeNodeList.remove(NodeName)  #为什么需要移除本节点？
        #print NodeName
        try:
            NodeObj = hw_ipran_node.objects.get(name=NodeName)
        except:
            #print NodeName  #根据链接关系的节点名称，无法在节点表查到相应的节点。华为的原因，得问清楚
            print u'无法更新{0}环"{1}"节点的下挂业务数，因为在节点表中未查到改点'.format(ring, NodeName)

        BusinessAmount = 0
        for TreeNodeName in TreeNodeList:
            TreeNodeObj = hw_ipran_node.objects.get(name=TreeNodeName)
            BusinessAmount += TreeNodeObj.SelfBusinessAmount

        NodeObj.BusinessAmount = BusinessAmount
        NodeObj.save()
