#-*- coding:utf8 -*-
#
from django.contrib import admin

# Register your models here.
from .models import *

@admin.register(odf_images_table)
class odf_images_tableAdmin(admin.ModelAdmin):
	list_display = ('Index', 'Lab', 'Position')		#由于hw_ipran_node表中的ring是多对多的，不能加入list_display
	search_fields = ['Position']