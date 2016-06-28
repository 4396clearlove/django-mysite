#-*- coding:utf8 -*-

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from .models import *
import re
import json


def bmapOpticalCable(request):
    if checkMobile(request):
        return render(request, 'trans_book/bmap_optical_cable_mobile.html')
    return render(request, 'trans_book/bmap_optical_cable.html')

def bmapSearchCable(request):
    if request.method=='POST':
        keyWord = request.POST['id']
        placemarkObj = coordinates_table.objects.get(ElementIdent=keyWord)   #filter返回的是一个列表，get返回的是单独一个对象
        coordinates = placemarkObj.Coordinates
        BMPoints = placemarkObj.BMPoints
        placemarkType = placemarkObj.Type    #1为折线，2为点
        pk = placemarkObj.pk    #为什么需要提取主键？通过主键来区分覆盖物

        if BMPoints==None:
            coordinateType = "GPS"
            coordinateList = []
            for coordinate in coordinates.strip().split(' '):
                #coordinateList.append([coordinate.split(',')[0],coordinate.split(',')[1]])
                coordinateList.append({"lng":coordinate.split(',')[0],"lat":coordinate.split(',')[1]})
        else:
            coordinateType = "BaiDu"
            coordinateList = json.loads(BMPoints)

        return JsonResponse(
            {
            "placemarkType":placemarkType, 
            "coordinates":coordinateList, 
            "pk":pk, 
            "coordinateType":coordinateType
            },
            safe=False  #必须得添加，只要构建的对象中有数组
        )

def bmapStorePoints(request):
    if request.method=='POST':
        pk = request.POST['pk']
        points = request.POST['points']
        placemarkObj = coordinates_table.objects.get(pk=pk)
        placemarkObj.BMPoints = points
        placemarkObj.save()

        return HttpResponse('success')


def bmapUploadImg(request):
    if request.method=="POST":
        #import pdb;pdb.set_trace()
        #img = request.POST['file']  #应该使用request.FILES['file']
        img = request.FILES['file'] #这里的img是一个InMemoryUploadedFile对象，无法直接存到文件，需要read出再存
        with open('test.png','wb') as f:
            f.write(img.read())
        return HttpResponse('success')


def ztreeGetNodes(request):
    if request.method=='POST':
        if request.POST.has_key('id'):
            id = request.POST['id']
            level0ObjList = coordinates_table.objects.filter(ParentIdent=id)
        else:
            level0ObjList = coordinates_table.objects.filter(Level=0)

        content = []
        for level0Obj in level0ObjList:
            id = level0Obj.ElementIdent
            name = level0Obj.Name
            type = level0Obj.Type
            if type==0:
                isParent = True
            else:
                isParent = False

            content.append({"id":id,"name":name,"isParent":isParent})
        #test = [{'name':'test1','isParent':True},{'name':"test2"}]
        return JsonResponse(content,safe=False)
    """
    import codecs
    if request.method=='POST':
        with codecs.open(settings.ZTREE_JSON, 'r', 'utf16') as f:
            content = f.read()

        return JsonResponse(json.loads(content),safe=False)
    """


#判断网站来自mobile还是pc
def checkMobile(request):
    userAgent = request.META['HTTP_USER_AGENT']

    _long_matches = r'googlebot-mobile|android|avantgo|blackberry|blazer|elaine|hiptop|ip(hone|od)|kindle|midp|mmp|mobile|o2|opera mini|palm( os)?|pda|plucker|pocket|psp|smartphone|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce; (iemobile|ppc)|xiino|maemo|fennec'
    _long_matches = re.compile(_long_matches, re.IGNORECASE)
    _short_matches = r'1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-'
    _short_matches = re.compile(_short_matches, re.IGNORECASE)

    if _long_matches.search(userAgent) != None:
        return True
    user_agent = userAgent[0:4]
    if _short_matches.search(user_agent) != None:
        return True
    return False

def ztree(request):
    return render(request, 'trans_book/test_ztree.html')

def ztreegetdata(request):
    if request.method=='POST':
        import pdb;pdb.set_trace()
        if request.POST.has_key('pk'):
            pk = request.POST['pk']
            level0ObjList = coordinates_table.objects.filter(ParentIdent=pk)
        else:
            level0ObjList = coordinates_table.objects.filter(Level=0)

        content = []
        for level0Obj in level0ObjList:
            id = level0Obj.ElementIdent
            name = level0Obj.Name
            type = level0Obj.Type
            if type==0:
                isParent = True
            else:
                isParent = False

            content.append({"id":id,"name":name,"isParent":isParent})
        #test = [{'name':'test1','isParent':True},{'name':"test2"}]
        return JsonResponse(content,safe=False)

def ztreeSearch(request):
    import time
    t1 = time.time()
    if request.method=='POST':
        kw = request.POST['kw']
        searchObjList = coordinates_table.objects.filter(Name__contains=kw)  #ToDo Test

        contentList = []        #存所有查询的结果，最后返回给前端
        parentIdentList = []    #存所有节点的父节点
        elementIdentList = []   #存所有节点的唯一标识
        i=1
        for searchObj in searchObjList:
            if searchObj.Type==0:   #文件夹则设isParent为True
                isParent = True
            else:
                isParent = False
            contentList.append({
                'name':searchObj.Name,
                'id':searchObj.ElementIdent,
                'pId':searchObj.ParentIdent,
                #'type':searchObj.Type,
                'isParent':isParent
            })
            if searchObj.ParentIdent not in parentIdentList:
                parentIdentList.append(searchObj.ParentIdent)

            elementIdentList.append(searchObj.ElementIdent)

        # print u"需查询节点数%d" % len(searchObjList)
        # print u"需查询父节点数%d" % len(parentIdentList)

        while len(parentIdentList)!=0:
            ident = parentIdentList.pop()
            if ident:
                obj = coordinates_table.objects.get(ElementIdent=ident)
                i += 1
                if obj.ElementIdent not in elementIdentList:
                    contentList.append({
                        'name':obj.Name,
                        'id':obj.ElementIdent,
                        'pId':obj.ParentIdent,
                        'type':obj.Type
                        })
                    elementIdentList.append(obj.ElementIdent)
                if obj.ParentIdent not in parentIdentList:
                    parentIdentList.append(obj.ParentIdent)

        # print len(contentList)
        # print time.time()-t1
        # print u"总查询次数：%d" % i #查询次数

        return JsonResponse(contentList,safe=False)