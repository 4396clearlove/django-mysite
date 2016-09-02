#-*- coding:utf8 -*-
from django.conf.urls import url
#from django.views.generic import TemplateView

from . import views

urlpatterns = [
    url(r'^$', views.ipran_ring),
    url(r'^index$', views.IndexView.as_view(), name='index'),
    url(r'^search_by_name/$', views.IndexSearchView.as_view()),
    url(r'^search_by_phystation/$', views.analysisPhyStation),
    url(r'^analysis_excel/$', views.analysis_excel),
    url(r'^(?P<type>(hw_ipran|hw_sdh|fh_ipran|fh_sdh))/(?P<pk>[0-9]+)/$', views.DetailView.as_view(), name='node_detail'),
    url(r'^bootstrap_table/data', views.bootstrap_table_data),
    # url(r'^tzquery/$', views.IndexSearchView.as_view(), name='node_list'),
    # url(r'^tzquery/form_test/$', views.get_name),
    # url(r'^test$', views.test),
    # url(r'^tzquery/long_chain/$', views.LongChainView.as_view(), name="long_chain"),   
    # url(r'^ring/$', views.ring),
    # url(r'^statistic/$', views.statistic),
    # url(r'^exceeded-node/$', views.exceeded_node),
    # url(r'^test_fh_ipran/$', views.test_fh_ipran_ring)
]