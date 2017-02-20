#-*- coding:utf8 -*-
from django.contrib import admin

# Register your models here.
from .models import *

class hw_ipran_nodeAdmin(admin.ModelAdmin):
    list_display = ('name', 'StationName', 'ShortName', 'node_type')        #由于hw_ipran_node表中的ring是多对多的，不能加入list_display
    search_fields = ['name']

class hw_ipran_linkAdmin(admin.ModelAdmin):
    list_display = ('source', 'dest', 'ring')
    search_fields = ['source', 'dest']

    def save_model(self, request, obj, form, change):
        #obj是修改后的对象，form是返回的表单
        #当新建一个对象时 change = False, 当修改一个对象时 change = True
        obj.save()
        import pdb;pdb.set_trace()
        if obj.isDelete==True:
            updateNodeBusinessAmountByRing(obj.ring)

class fh_ipran_nodeAdmin(admin.ModelAdmin):
    list_display = ('NeId', 'NeName')
    search_fields = ['NeName']

class fh_ipran_topolinkAdmin(admin.ModelAdmin):
    list_display = ('source', 'dest', 'Ring')

class coordinates_Admin(admin.ModelAdmin):
    list_display = ('Name', 'ElementIdent', 'ParentIdent','Coordinates')
    search_fields = ['Name']

class hw_ipran_business_2GAdmin(admin.ModelAdmin):
    list_display = ('StationName', 'TransStationName', 'Node')
    search_fields = ['StationName', 'TransStationName']
    raw_id_fields = ('Node',)   #外键选择方式不是选择框而是搜索框

@admin.register(ring)
class ringAdmin(admin.ModelAdmin):
    list_display = ('name', 'ringNodeNum', 'chainNodeNum')
    search_fields = ['name']

admin.site.register(hw_ipran_node, hw_ipran_nodeAdmin)
admin.site.register(hw_ipran_link, hw_ipran_linkAdmin)
admin.site.register(fh_ipran_node, fh_ipran_nodeAdmin)
admin.site.register(fh_ipran_topolink, fh_ipran_topolinkAdmin)
# admin.site.register(coordinates_table, coordinates_Admin)
admin.site.register(hw_ipran_business_2G, hw_ipran_business_2GAdmin)