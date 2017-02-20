#-*- coding:utf8 -*-

from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^update/$', views.update, name="update"),
    url(r'^pic/(?P<id>.*)$', views.odf_image, name="odf")
]