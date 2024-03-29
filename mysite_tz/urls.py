"""mysite_tz URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import netopo, cable, flow_monitor

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^netopo/', include('netopo.urls')),
    url(r'^ipran_ring/', include('netopo.urls')),
    url(r'^bmap/', include('cable.urls')),
    url(r'^flow_monitor/', include('flow_monitor.urls')),
    url(r'^odf/', include('odf_pic.urls'))
#] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
]

# if settings.DEBUG:
#     import debug_toolbar
#     urlpatterns.append(url(r'^__debug__/', include(debug_toolbar.urls)))