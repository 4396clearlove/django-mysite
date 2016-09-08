#-*- coding:utf8 -*-

from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^optical_cable/$', views.bmapOpticalCable),
    url(r'^optical_cable/upload/$', views.bmapUploadImg),
    url(r'^search_cable/$', views.bmapSearchCable),
    url(r'^store_points/$', views.bmapStorePoints),
    url(r'^get_ztree_nodes/$', views.ztreeGetNodes),
    url(r"^ztree/$", views.ztree),
    url(r"^ztree/getdata/$", views.ztreeGetNodes),
    url(r"^ztree/search/$", views.ztreeSearch),
    url(r"^mobile/easyui_tree/$", views.mobileEasyuiTree),
    url(r'^csv/$',views.csv),
    url(r"^main_polyline/$",views.main_polyline),
    url(r"^storeCSV", views.storeCSV)
]