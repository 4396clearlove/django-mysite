#-*- coding:utf8 -*-
from django.shortcuts import render
from django.views import generic
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse

# from .models import Node, hw_3g_sf, NodeSearch, hw_ipran_node, hw_ipran_ring, hw_ipran_link,hw_ipran_business_2G,\
#                     hw_ipran_business_3G_E1, hw_ipran_business_3G_FE, hw_ipran_business_LTE, coordinates_table,\
#                     fh_ipran_topolink
from .models import *
#from .forms import NameForm, ContactForm, NodeForm, ContactFormSet, IndexForm, UploadForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.db import connections

import json
import re
import copy
import StringIO
import networkx as nx
from networkx.readwrite import json_graph
from xlrd import open_workbook 
# Create your views here.
def find_node_by_id(request):
	node = get_object_or_404(Node, node_id=request.GET['node_id'])
	node.hw_3g_sf_set.all()

	return render(request, 'associated_station.html')

"""
class StationView(generic.ListView):	#ListView: working with many Django objects;DetailView: working with a single Django object
#测试1572#市桥南堤，下挂一个节点
#测试9637#南国奥园中，下挂两个节点
    template_name = 'trans_book/associated_station.html'
    #context_object_name = 'node'   #这是与get_queryset配合使用的，可以被get_context_data取代

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        #print '789'
        node = get_object_or_404(Node, node_id=self.request.GET['node_id']) #只能查得一个结果
        node_down = node.node_set.all() #所有主节点的下挂节点
        context = super(StationView, self).get_context_data(**kwargs)
        # Add in the publisher
        context['node'] = node
        context['node_down'] = node_down
        return context

    def get_queryset(self): #这个函数可以被get_context_data取代，先执行，再执行get_context_data
        #返回节点对应的基站名称.
        #print '123456'
        #self.node = get_object_or_404(Node, node_id=self.request.GET['node_id'])
        #node = Node.objects.get(node_id=self.request.GET['node_id'])	#上行取代
        #return Node.objects.get(node_id=self.request.GET['node_id'])
        return None
"""

"""
class StationView(generic.ListView):    #ListView: working with many Django objects;DetailView: working with a single Django object
#测试1572#市桥南堤，下挂一个节点
#测试9637#南国奥园中，下挂两个节点
#根据网元名来查
    template_name = 'trans_book/associated_station.html'
    #context_object_name = 'node'   #这是与get_queryset配合使用的，可以被get_context_data取代

    #@csrf_exempt
    def post(self, request):    #无法通过ajax的post方法来访问，会被403禁止，应为cspf保护。加了@csrf_exempt也不行。只能独立写一个view函数
        #print '123'
        #return JsonResponse({'test'})
        #form = IndexForm(request.POST, request.FILES)
        #if form.is_valid():
            #self.handle_uploaded_excel(request.FILES['uploaded_file'])
        station_name = request.POST["station_name"]
        node_dict = self.get_similar_station(station_name)
        return HttpResponse(json.dumps(node_dict))

    def handle_uploaded_excel(self, f):
        #import pdb
        #pdb.set_trace()
        with open('test_upload.xlsx', 'wb+') as destination:
            for chunk in f.chunks():
                destination.write(chunk)
        import pdb
        pdb.set_trace()
        wb = open_workbook('test_upload.xlsx')

    def get_similar_station(self, station_name):
        #node = get_object_or_404(Node, ) #只能查得一个结果
        node_dict = {}
        node = Node.objects.filter(name__contains=station_name)
        for _ in node:
            node_dict.setdefault(_.pk, _.name)
        return node_dict


    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        #print '789'
        node = get_object_or_404(Node, node_id=self.request.GET['node_id']) #只能查得一个结果
        node_down = node.node_set.all() #所有主节点的下挂节点
        context = super(StationView, self).get_context_data(**kwargs)
        # Add in the publisher
        context['node'] = node
        context['node_down'] = node_down
        return context

    def get_queryset(self): #这个函数可以被get_context_data取代，先执行，再执行get_context_data
        #返回节点对应的基站名称.
        #print '123456'
        #self.node = get_object_or_404(Node, node_id=self.request.GET['node_id'])
        #node = Node.objects.get(node_id=self.request.GET['node_id'])   #上行取代
        #return Node.objects.get(node_id=self.request.GET['node_id'])
        return None
"""

class DetailView(generic.DetailView):
    #model = Node    #传给模板的是node:xx
    template_name = 'trans_book/detail.html'    #有了下面的get，这个模板设置就没用了

    def get(self, request, **kwargs):   #kwargs字典中包含url中路径的参数
        pk = kwargs['pk']
        type = kwargs['type']
        if type=='hw_ipran':
            NodeObj = hw_ipran_node.objects.get(pk=pk)  #根据节点主键值得出节点Obj
            NodeName = NodeObj.name     #节点名称
            # RingObj = NodeObj.ring
            RingName = NodeObj.Ring
            
            # root = RingObj.root

            # LinkList = []
            # for link in RingObj.hw_ipran_link_set.all():
            #     LinkList.append((link.source,link.dest))
            # if len(root)>=1:
            #     z = zip(*[iter(root[i:]) for i in range(2)])
            #     LinkList.extend(z)
            linkList = hw_ipran_link.objects.filter(ring=RingName).values_list('source','dest')
            # 'ValuesListQuerySet' object has no attribute 'extend'，所以得转为list
            linkList = list(linkList)
            nodeTuple = reduce(lambda x,y:x+y, linkList)     #[(1,2),(2,3)]-->(1,2,2,3)
            nodeTuple = tuple(set(nodeTuple))  #(1,2,2,3)-->{1,2,3}-->(1,2,3)
            rootNodeTuple = tuple(a for a in nodeTuple if re.search(r'J\d{3,4}',a))  #过滤带环节点，不加tuple是一个生成器，无法计算长度
            rootLinkList = zip(*[iter(rootNodeTuple[i:]) for i in range(2)])   #(1,2,3,4)-->[(1,2),(2,3),(3,4)]    (1,)-->[]   ()-->[]

            # if len(root)>=1:
            #     z = zip(*[iter(root[i:]) for i in range(2)])
            #     linkList.extend(z)
            #     
            linkList.extend(rootLinkList)

            import networkx as nx
            G = nx.Graph()
            G.add_edges_from(linkList)
            
            
            try:
                CycleNode = nx.cycle_basis(G)[0]    #根据图生成环
            except:
                CycleNode = []    #无法生成环，则设环为空列表
                
            if NodeName in CycleNode:    #如果想要查询的节点为环上节点，则移除其它环节点(不包括支链节点)
                CycleNode.remove(NodeName)
                G.remove_nodes_from(CycleNode)
            else:    #如果想要查询的节点不为环上节点，则计算带环节点至该节点的最短路径经过的节点，并移除。
                ShortestNode = nx.dijkstra_path(G,rootNodeTuple[0],NodeName) 
                ShortestNode.remove(NodeName)
                G.remove_nodes_from(ShortestNode)
                
            H = nx.dfs_tree(G,NodeName) #最后即可通过生成树协议获得节点所下带的节点
            Nnode = H.number_of_nodes()

            #接下来得分析下带的业务数及业务名称
            #import pdb;pdb.set_trace()
            Indexbusiness = 1
            #BusinessDict = {'2G':[],'3G_E1':[],'3G_FE':[],'LTE':[]}
            BusinessList = list()
            for node in H.nodes():
                
                Obj2GList = hw_ipran_business_2G.objects.filter(Node__name=node)
                Obj3GE1List = hw_ipran_business_3G_E1.objects.filter(Node__name=node)
                Obj3GFEList = hw_ipran_business_3G_FE.objects.filter(Node__name=node)
                ObjLTEList = hw_ipran_business_LTE.objects.filter(Node__name=node)

                #Nbusiness = len(Obj2GList)+len(Obj3GE1List)+len(Obj3GFEList)+len(ObjLTEList)+Nbusiness  #下带业务数
                #import pdb;pdb.set_trace()
                for obj in Obj2GList:
                    #BusinessDict['2G'].append({node:obj.TransStationName})
                    BusinessDict = dict()
                    BusinessDict['id'] = Indexbusiness
                    BusinessDict['station'] = obj.TransStationName
                    BusinessDict['node'] = node
                    BusinessDict['ring'] = RingName
                    BusinessList.append(BusinessDict)
                    Indexbusiness +=  1
                for obj in Obj3GE1List:
                    #BusinessDict['3G_E1'].append({node:obj.TransStationName})
                    BusinessDict = dict()
                    BusinessDict['id'] = Indexbusiness
                    BusinessDict['station'] = obj.TransStationName
                    BusinessDict['node'] = node
                    BusinessDict['ring'] = RingName
                    BusinessList.append(BusinessDict)
                    Indexbusiness +=  1
                for obj in Obj3GFEList:
                    #BusinessDict['3G_FE'].append({node:obj.TransStationName})
                    BusinessDict = dict()
                    BusinessDict['id'] = Indexbusiness
                    BusinessDict['station'] = obj.TransStationName
                    BusinessDict['node'] = node
                    BusinessDict['ring'] = RingName
                    BusinessList.append(BusinessDict)
                    Indexbusiness +=  1
                for obj in ObjLTEList:
                    #BusinessDict['LTE'].append({node:obj.TransStationName})
                    BusinessDict = dict()
                    BusinessDict['id'] = Indexbusiness
                    BusinessDict['station'] = obj.TransStationName
                    BusinessDict['node'] = node
                    BusinessDict['ring'] = RingName
                    BusinessList.append(BusinessDict)
                    Indexbusiness +=  1

            #return JsonResponse({Nnode:Nnode,Nbusiness:Nbusiness})
            #return HttpResponse(u"%s<br/>节点数:%d<br/>业务数:%d" % (NodeName, Nnode, Nbusiness))
            #return JsonResponse({'ring':RingName,'BusinessList':BusinessList})
            return JsonResponse(BusinessList, safe=False)

        """
        node = Node.objects.get(pk=pk)
        node_down, business_down = self.get_down_nodes(node)
        json_content = {
            "station-name":node.name,
            "node-down":node_down,
            #"node-down":[123,213],
            "business-down":business_down,
            "ring":node.ring,
        }
        return JsonResponse(json_content)   #传入字典，转为json字符，并回传
        """

    def get_down_nodes(self, node): #先获取下挂节点的函数
        #import pdb
        #pdb.set_trace()
        """
        版本2：通过NodeSearch表来实现
        leaves = 
        """
        
        #版本1，通过函数嵌套来实现
        node_down = node.node_set.all() #结果是一个listzNone
        node_down_list = []
        business_down_list = []
        node_down_list.append({node.pk:node.name})
        
        business_down_list.extend(self.get_node_business(node))


        if len(node_down) != 0:
            for i in node_down:
                a,b = self.get_down_nodes(i)    #函数嵌套来实现循环
                node_down_list.extend(a)   #这里用extend
                business_down_list.extend(b)
        
        return node_down_list, business_down_list

        

    def get_node_business(self, node):
        business_list = []
        for station in node.hw_3g_sf_set.all():
            business_list.append(station.jz_name)
        for station in node.hw_3g_fe_set.all():
            business_list.append(station.jz_name)
        for station in node.hw_3g_jz_set.all():
            business_list.append(station.jz_name)
        return business_list
        

class IndexView(generic.TemplateView):  #TemplateView也是支持get_context_data
    template_name = "trans_book/index.html"

    #def get(self, request):     #重写了get的话，就不调用get_context_data了。
    #    print '12321'
    #    self.get_context_data(**kwargs)
    #    return HttpResponse('test')

    def post(self, request):    #默认class-based views的post()是关闭的，就是post请求是被拒绝的
        print '1234'

        return HttpResponse(str(self.get_context_data()))

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(IndexView, self).get_context_data(**kwargs)

        #context['index_form'] = IndexForm()
        #context['upload_form'] = UploadForm()
        return context


def index(request):
	return render(request, 'trans_book/index.html')

def get_name(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        index_form = NodeForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            #subject = form.cleaned_data['subject']
            #message = form.cleaned_data['message']
            #sender = form.cleaned_data['sender']
            #cc_myself = form.cleaned_data['cc_myself']
            #print cc_myself
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            #return HttpResponseRedirect('trans_book/index.html')
            return HttpResponse('success')

    # if a GET (or any other method) we'll create a blank form
    else:
        node = Node.objects.get(pk=15455)
        index_form = NodeForm(instance=node)
        #form = ContactFormSet()

    return render(request, 'trans_book/bootstrap3_test.html', {'form': index_form})

def test(request):
    return render(request, 'trans_book/index_pre.html')


def analysis_excel(request):
    if request.method == 'POST':
        f = StringIO.StringIO()
        for chunk in request.FILES['excel'].chunks():
            f.write(chunk)
        f.seek(0)   #必须把文件指针置0，才能被读出
        wb = open_workbook(file_contents=f.read())
        ws = wb.sheet_by_index(0)
        f.close()
        return JsonResponse(ws.col_values(1), safe=False)

#TODO 待删除
# def handle_uploaded_excel(f):
#     with open('test_upload.xlsx', 'wb+') as destination:
#         for chunk in f.chunks():
#             destination.write(chunk)
#     wb = open_workbook('test_upload.xlsx')



class LongChainView(generic.View):  #返回大于特定节点数的长链

    def post(self, request):
        num = int(request.POST['nodes_num'])
        output = []     #输出的结果
        
        for row in NodeSearch.objects.filter(leaves_nums__gte=num):
            node = Node.objects.get(pk=row.id)   #节点pk
            node_down, business_down = self.get_down_nodes(node)
            json_content = {
            "station-name":node.name,
            "node-down":node_down,
            #"node-down":[123,213],
            "business-down":business_down,
            "ring":node.ring,
            }
            output.append(json_content)
        #import pdb;pdb.set_trace()  
        return JsonResponse(output, safe=False)   #传入字典或set（传入列表会失败），转为json字符，并回传。如果safe为False，则可以传入列表

        #count = 1

        #return HttpResponse(json.dumps(output)）


    def get_down_nodes(self, node): #根据节点获取下挂的所有节点

        node_down = node.node_set.all() #结果是一个listzNone
        node_down_list = []
        business_down_list = []
        node_down_list.append({node.pk:node.name})
        
        business_down_list.extend(self.get_node_business(node))


        if len(node_down) != 0:
            for i in node_down:
                a,b = self.get_down_nodes(i)    #函数嵌套来实现循环
                node_down_list.extend(a)   #这里用extend
                business_down_list.extend(b)
        
        return node_down_list, business_down_list
  

    def get_node_business(self, node):  #根据节点获取该节点下挂的所有业务
        business_list = []
        for station in node.hw_3g_sf_set.all():
            business_list.append(station.jz_name)
        for station in node.hw_3g_fe_set.all():
            business_list.append(station.jz_name)
        for station in node.hw_3g_jz_set.all():
            business_list.append(station.jz_name)
        return business_list



class IndexSearchView(generic.View):    #ListView: working with many Django objects;DetailView: working with a single Django object
#测试1572#市桥南堤，下挂一个节点
#测试9637#南国奥园中，下挂两个节点
#根据网元名来查
    #template_name = 'trans_book/associated_station.html'
    #context_object_name = 'node'   #这是与get_queryset配合使用的，可以被get_context_data取代

    #@csrf_exempt
    def post(self, request):    #无法通过ajax的post方法来访问，会被403禁止，应为cspf保护。加了@csrf_exempt也不行。只能独立写一个view函数
        station_name = request.POST["station_name"]

        NodeDictList = list()
        id = 1
        #华为分组
        NodeObjList = hw_ipran_node.objects.filter(name__contains=station_name)
        for NodeObj in NodeObjList:
            HwIpranNodeDict = {
                'id':id,
                'station':
                    {
                        'name':NodeObj.name, 
                        'pk':NodeObj.pk, 
                        'type':'hw_ipran', 
                        'ring':NodeObj.Ring,
                        'bnum':NodeObj.BusinessAmount
                    }
            }
            id += 1
            NodeDictList.append(HwIpranNodeDict)
        #烽火分组
        NodeObjList = fh_ipran_node.objects.filter(NeName__contains=station_name)
        for NodeObj in NodeObjList:
            FhIpranNodeDict = {
                'id':id,
                'station':{
                    'name':NodeObj.NeName,
                    'pk':NodeObj.pk,
                    'type':'fh_ipran',
                    'ring':NodeObj.Ring,
                    'bnum':0
                }
            }
            id += 1
            NodeDictList.append(FhIpranNodeDict)

        return JsonResponse(NodeDictList, safe=False)
        #返回数据：[{'id':int,'station':obj1,'bnum':int}..]; obj1={'name':str,'type':str, 'pk':int}

    def handle_uploaded_excel(self, f):
        with open('test_upload.xlsx', 'wb+') as destination:
            for chunk in f.chunks():
                destination.write(chunk)
        import pdb
        pdb.set_trace()
        wb = open_workbook('test_upload.xlsx')

    def get_similar_station(self, station_name):
        #node = get_object_or_404(Node, ) #只能查得一个结果
        node_dict = {}
        node = Node.objects.filter(name__contains=station_name)
        for _ in node:
            node_dict.setdefault(_.pk, _.name)
        return node_dict


    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        #print '789'
        node = get_object_or_404(Node, node_id=self.request.GET['node_id']) #只能查得一个结果
        node_down = node.node_set.all() #所有主节点的下挂节点
        context = super(StationView, self).get_context_data(**kwargs)
        # Add in the publisher
        context['node'] = node
        context['node_down'] = node_down
        return context

    def get_queryset(self): #这个函数可以被get_context_data取代，先执行，再执行get_context_data
        #返回节点对应的基站名称.
        #print '123456'
        #self.node = get_object_or_404(Node, node_id=self.request.GET['node_id'])
        #node = Node.objects.get(node_id=self.request.GET['node_id'])   #上行取代
        #return Node.objects.get(node_id=self.request.GET['node_id'])
        return None

# def ring(request):
#     if request.method == 'POST':
#         ring = request.POST['ring']
        
#         nodes = Node.objects.filter(ring=ring)
        
#         #import pdb;pdb.set_trace()
#         x = []
#         for i, node in enumerate(nodes):
#             y = {}
#             y['index'] = i
#             y['name'] = node.pk     #以主键值作为echarts节点名称，唯一的
#             y['value'] = node.name
#             if node.chain_node == None:
#                 while nodes[(i+1)%len(nodes)].chain_node!=None:
#                     i += 1
#                 y['target'] = nodes[(i+1)%len(nodes)].pk
#             else:
#                 y['target'] = node.chain_node.pk
#             x.append(y)

#         return JsonResponse(x, safe=False)   #传入字典或set（传入列表会失败），转为json字符，并回传。如果safe为False，则可以传入列表
#     return render(request, 'trans_book/ring.html')

def ipran_ring(request):
    if request.method == 'POST':    #生成echarts图所需数据
        RingName = request.POST['ring']
        type = request.POST['type']
        if type=='hw_ipran':
            linkList = hw_ipran_link.objects.filter(ring=RingName).values_list('source','dest')
            # 'ValuesListQuerySet' object has no attribute 'extend'，所以得转为list

            linkList = list(linkList)   #转为list类型才能extend带环点对接
            nodeList = reduce(lambda x,y:x+y, linkList)     #[(1,2),(2,3)]-->(1,2,2,3)
            nodeList = list(set(nodeList))  #(1,2,2,3)-->{1,2,3}-->(1,2,3)
            rootNodeList = list(a for a in nodeList if re.search(r'J\d{3,4}',a))  #过滤带环节点，不加tuple是一个生成器，无法计算长度
            rootLinkList = zip(*[iter(rootNodeList[i:]) for i in range(2)])   #(1,2,3,4)-->[(1,2),(2,3),(3,4)]    (1,)-->[]   ()-->[]

            linkList.extend(rootLinkList)
            G = nx.Graph(
                    ring=RingName,
                    EquipmentType='hw_ipran')
            G.add_edges_from(linkList)
            G.add_nodes_from(rootNodeList,type='root')

            #计算环路节点数及支链节点数，并设置属性
            try:
                CycleNode = nx.cycle_basis(G)[0]    #根据图生成环
                CycleNodeNum = len(CycleNode)-len(rootNodeList)
                ChainNodeNum = len(nodeList)-len(CycleNode)
            except:
                CycleNode = []    #无法生成环，则设环为空列表
                CycleNodeNum = 0
                ChainNodeNum = len(nodeList)-len(rootNodeList)
            
            G.graph['CycleNodeNum'] = CycleNodeNum  #设置属性
            G.graph['ChainNodeNum'] = ChainNodeNum

            #计算除带环点的其余节点所带节点数
            for node in nodeList:    #两个列表的差集
                G.node[node]['name'] = node     #设置节点名称
                if node in rootNodeList:
                    continue

                I = G.copy()
                CycleNodeCopy = copy.deepcopy(CycleNode)
                try:
                    if node in CycleNodeCopy:    #如果想要查询的节点为环上节点，则移除其它环节点(不包括支链节点)
                        CycleNodeCopy.remove(node)
                        I.remove_nodes_from(CycleNodeCopy)
                    else:    #如果想要查询的节点不为环上节点，则计算带环节点至该节点的最短路径经过的节点，并移除。
                        ShortestNode = nx.dijkstra_path(I,rootNodeList[0],node) 
                        ShortestNode.remove(node)
                        I.remove_nodes_from(ShortestNode)
                        
                    H = nx.dfs_tree(I,node) #最后即可通过生成树协议获得节点所下带的节点
                    Nnode = H.number_of_nodes()
                    Nbusiness = hw_ipran_node.objects.get(name=node).BusinessAmount
                except:
                    Nnode = u'未知'
                    Nbusiness = None


                G.node[node]['Nnode'] = Nnode
                G.node[node]['Nbusiness'] = Nbusiness

        elif type=="fh_ipran":
            linkList = fh_ipran_topolink.objects.filter(Ring=RingName).values_list('source','dest')
            linkList = list(linkList)   #转为list类型才能extend带环点对接
            nodeList = reduce(lambda x,y:x+y, linkList)     #[(1,2),(2,3)]-->(1,2,2,3)
            nodeList = list(set(nodeList))  #(1,2,2,3)-->{1,2,3}-->(1,2,3)
            rootNodeList = list(a for a in nodeList if re.search(r'HX|HJ',a))  #过滤带环节点，不加tuple是一个生成器，无法计算长度
            rootLinkList = zip(*[iter(rootNodeList[i:]) for i in range(2)])   #(1,2,3,4)-->[(1,2),(2,3),(3,4)]    (1,)-->[]   ()-->[]

            linkList.extend(rootLinkList)
            G = nx.Graph(
                    ring=RingName,
                    EquipmentType='fh_ipran')
            G.add_edges_from(linkList)
            G.add_nodes_from(rootNodeList,type='root')

            #计算环路节点数及支链节点数，并设置属性
            try:
                CycleNode = nx.cycle_basis(G)[0]    #根据图生成环
                CycleNodeNum = len(CycleNode)-len(rootNodeList)
                ChainNodeNum = len(nodeList)-len(CycleNode)
            except:
                CycleNode = []    #无法生成环，则设环为空列表
                CycleNodeNum = 0
                ChainNodeNum = len(nodeList)-len(rootNodeList)
            
            G.graph['CycleNodeNum'] = CycleNodeNum  #设置属性
            G.graph['ChainNodeNum'] = ChainNodeNum

            #计算除带环点的其余节点所带节点数
            for node in nodeList:    #两个列表的差集
                G.node[node]['name'] = node     #设置节点名称
                if node in rootNodeList:
                    continue

                I = G.copy()
                CycleNodeCopy = copy.deepcopy(CycleNode)
                try:
                    if node in CycleNodeCopy:    #如果想要查询的节点为环上节点，则移除其它环节点(不包括支链节点)
                        CycleNodeCopy.remove(node)
                        I.remove_nodes_from(CycleNodeCopy)
                    else:    #如果想要查询的节点不为环上节点，则计算带环节点至该节点的最短路径经过的节点，并移除。
                        ShortestNode = nx.dijkstra_path(I,rootNodeList[0],node) 
                        ShortestNode.remove(node)
                        I.remove_nodes_from(ShortestNode)
                        
                    H = nx.dfs_tree(I,node) #最后即可通过生成树协议获得节点所下带的节点
                    Nnode = H.number_of_nodes()
                    #Nbusiness = hw_ipran_node.objects.get(name=node).BusinessAmount
                except:
                    Nnode = u'未知'
                    Nbusiness = None


                G.node[node]['Nnode'] = Nnode
                #G.node[node]['Nbusiness'] = Nbusiness

        H = nx.convert_node_labels_to_integers(G)   #转为id:0,name:'xx'
        return JsonResponse(json_graph.node_link_data(H))
    return render(request, 'trans_book/ring_hw_ipran.html')


def statistic(request):
    import json

    #import pdb;pdb.set_trace()
    NodeName = request.POST['name']
    RingName = request.POST['ring']
    #links    = request.POST['links']    #是一个列表的json
    #links    = json.loads(links)
    #root     = request.POST('root')
    #root     = json.loads(root)
    #RingObj   = hw_ipran_ring.objects.get(name=RingName)
    NodeObj   = hw_ipran_node.objects.get(name=NodeName)
    # root = RingObj.root    #这里是一个列表,添加带环点的对接

    # LinkList = []
    # for link in RingObj.hw_ipran_link_set.all():
    #     LinkList.append((link.source,link.dest))
    # if len(root)>=1:
    #     z = zip(*[iter(root[i:]) for i in range(2)])
    #     LinkList.extend(z)
    
    linkList = hw_ipran_link.objects.filter(ring=RingName).values_list('source','dest')
    # 'ValuesListQuerySet' object has no attribute 'extend'，所以得转为list
    linkList = list(linkList)
    nodeTuple = reduce(lambda x,y:x+y, linkList)     #[(1,2),(2,3)]-->(1,2,2,3)
    nodeTuple = tuple(set(nodeTuple))  #(1,2,2,3)-->{1,2,3}-->(1,2,3)
    rootNodeTuple = tuple(a for a in nodeTuple if re.search(r'J\d{3,4}',a))  #过滤带环节点，不加tuple是一个生成器，无法计算长度
    rootLinkList = zip(*[iter(rootNodeTuple[i:]) for i in range(2)])   #(1,2,3,4)-->[(1,2),(2,3),(3,4)]    (1,)-->[]   ()-->[]
    linkList.extend(rootLinkList)


    G = nx.Graph()
    G.add_edges_from(linkList)
   
    try:
        CycleNode = nx.cycle_basis(G)[0]    #根据图生成环
    except:
        CycleNode = []    #无法生成环，则设环为空列表
        
    if NodeName in CycleNode:    #如果想要查询的节点为环上节点，则移除其它环节点(不包括支链节点)
        CycleNode.remove(NodeName)
        G.remove_nodes_from(CycleNode)
    else:    #如果想要查询的节点不为环上节点，则计算带环节点至该节点的最短路径经过的节点，并移除。
        ShortestNode = nx.dijkstra_path(G,rootNodeTuple[0],NodeName) 
        ShortestNode.remove(NodeName)
        G.remove_nodes_from(ShortestNode)
        
    H = nx.dfs_tree(G,NodeName) #最后即可通过生成树协议获得节点所下带的节点
    Nnode = H.number_of_nodes()

    #接下来得分析下带的业务数及业务名称
    #import pdb;pdb.set_trace()
    Nbusiness = 0
    BusinessDict = {'2G':[],'3G_E1':[],'3G_FE':[],'LTE':[]}
    for node in H.nodes():
        Obj2GList = hw_ipran_business_2G.objects.filter(Node__name=node)
        Obj3GE1List = hw_ipran_business_3G_E1.objects.filter(Node__name=node)
        Obj3GFEList = hw_ipran_business_3G_FE.objects.filter(Node__name=node)
        ObjLTEList = hw_ipran_business_LTE.objects.filter(Node__name=node)

        Nbusiness = len(Obj2GList)+len(Obj3GE1List)+len(Obj3GFEList)+len(ObjLTEList)+Nbusiness  #下带业务数

        for obj in Obj2GList:
            BusinessDict['2G'].append({node:obj.TransStationName})
        for obj in Obj3GE1List:
            BusinessDict['3G_E1'].append({node:obj.TransStationName})
        for obj in Obj3GFEList:
            BusinessDict['3G_FE'].append({node:obj.TransStationName})
        for obj in ObjLTEList:
            BusinessDict['LTE'].append({node:obj.TransStationName})

    #return JsonResponse({Nnode:Nnode,Nbusiness:Nbusiness})
    #return HttpResponse(u"%s<br/>节点数:%d<br/>业务数:%d" % (NodeName, Nnode, Nbusiness))
    return JsonResponse({'NodeName':NodeName,'Nnode':Nnode,'Nbusiness':Nbusiness,'pk':NodeObj.pk,'BusinessDict':BusinessDict})

    
def exceeded_node(request):
    if request.method=='POST':
        #import pdb;pdb.set_trace()
        bnum = request.POST['bnum']
        NodeObjList = hw_ipran_node.objects.filter(BusinessAmount__gte=bnum)
        
        NodeDictList = list()
        for n,NodeObj in enumerate(NodeObjList):
            NodeDict = {
                'id':n+1,
                'station':{'name':NodeObj.name, 'type':"hw_ipran", 'pk':NodeObj.pk},
                'bnum':NodeObj.BusinessAmount
            }
            NodeDictList.append(NodeDict)

        return JsonResponse(NodeDictList,safe=False)
        #[{'id':int,'station':obj1,'bnum':int}..]; obj1={'name':str,'type':str, 'pk':int}


def test_fh_ipran_ring(request):
    # for linkObj in fh_ipran_topolink.objects.all():
    #     if linkObj.TopoNodeId1==linkObj.TopoNodeId2:
    #         continue
    #     linkObj.TopoNodeId1.NeName
    #import pdb;pdb.set_trace()
    if request.method == 'POST':
        #from .models import hw_ipran_ring
        RingName = request.POST['ring']

        linkList = fh_ipran_topolink.objects.filter(Ring=RingName).values_list('source','dest')
        # 'ValuesListQuerySet' object has no attribute 'extend'，所以得转为list
        linkList = list(linkList)
        nodeTuple = reduce(lambda x,y:x+y, linkList)     #[(1,2),(2,3)]-->(1,2,2,3)
        nodeTuple = tuple(set(nodeTuple))  #(1,2,2,3)-->{1,2,3}-->(1,2,3)
        rootNodeTuple = tuple(a for a in nodeTuple if re.search(r'HJ|HX',a))  #过滤带环节点，不加tuple是一个生成器，无法计算长度
        rootLinkList = zip(*[iter(rootNodeTuple[i:]) for i in range(2)])   #(1,2,3,4)-->[(1,2),(2,3),(3,4)]    (1,)-->[]   ()-->[]

        # if len(root)>=1:
        #     z = zip(*[iter(root[i:]) for i in range(2)])
        #     linkList.extend(z)
        #     
        linkList.extend(rootLinkList)

        G = nx.Graph(ring=RingName,EquipmentType='fh_ipran')
        G.add_edges_from(linkList)

        for x,node in enumerate(G.nodes()):
            G.node[node]['name'] = node

        G.add_nodes_from(rootNodeTuple,type='root')



        from networkx.readwrite import json_graph
        H = nx.convert_node_labels_to_integers(G)   #转为id:0,name:'xx'
        return JsonResponse(json_graph.node_link_data(H))


def analysisPhyStation(request):
    if request.method=='POST':
        #import pdb;pdb.set_trace()
        phyStationList = json.loads(request.POST['phyStation'])
        # nodeInfoList = list(hw_ipran_node.objects.filter(StationName=phyStation).values('name','StationName','Ring'))
        # ringNameList = hw_ipran_node.objects.filter(StationName=phyStation).values_list('Ring', flat=True).distinct()
        # #nodeRingInfoList = hw_ipran_node.objects.raw('select b.*,a.id,a.name,a.StationName from trans_book_hw_ipran_node as a left join trans_book_ring as b where a.ring=b.name and a.ring="R359"')
        #Todo 加入烽火节点检索
        #cursor = connection.cursor()
        nodeRingInfoList = []
        cursor = connections['netopo'].cursor()
        for phyStation in phyStationList:
            
            #with connection.cursor() as cursor:
            cursor.execute('''
                    select a.name,a.StationName,b.name as Ring,b.ringNodeNum,b.chainNodeNum
                    from netopo_hw_ipran_node as a
                    left join netopo_ring as b
                    where a.ring=b.name and a.StationName="%s"
                    '''% phyStation)
            columns = [col[0] for col in cursor.description]
            nodeRingInfoTmpList = [dict(zip(columns, row)) for row in cursor.fetchall()]
            nodeRingInfoList.extend(nodeRingInfoTmpList)

        cursor.close()
        # ringInfoDictList = []
        # for ringName in ringNameList:
        #     #ringDict = {ring:{}}
        #     ringInfoDict = list(ring.objects.filter(name=ringName).values())
        #     ringInfoDictList.extend(ringInfoDict)
        #import pdb;pdb.set_trace()
        #return JsonResponse(nodeInfoList, safe=False)
        return JsonResponse(nodeRingInfoList, safe=False)
