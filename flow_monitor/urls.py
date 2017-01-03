#-*- coding:utf8 -*-
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^index$', views.main, name="main"),
    url(r'^top5$', views.get_top5, name='top5'),
    url(r'^usage$', views.get_usage, name='usage')
]