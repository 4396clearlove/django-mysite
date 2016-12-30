#-*- coding:utf8 -*-
import sys, os
import django
import codecs
sys.path.append(os.path.abspath("../../.."))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite_tz.settings")
django.setup()  # 必须得先设置django启动才能使用model中的删除

from trans_book.models import *
import json

def main():
    tmpList = []
    for coordinatesObj in coordinates_table.objects.all():
        pk = coordinatesObj.pk
        name = coordinatesObj.Name
        type = coordinatesObj.Type
        tmpList.append({'pk':pk,'name':name,'type':type})

    with codecs.open('ztreeNode.json','w', 'utf-16') as f:
        f.write(json.dumps(tmpList, indent=4, ensure_ascii=False))

if __name__=="__main__":
    main()