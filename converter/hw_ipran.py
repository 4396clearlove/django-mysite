#-*-coding:utf8-*-
import re

def name_convert(name):
    pattern1 = re.compile(ur'^[\-a-zA-Z0-9 \u73af]+\-') #用于清除网元名中的前缀的英文字母及连接符,空格，还有'环'字
    pattern2 = re.compile(ur'[\(\uff08][^\)\uff09]*[\u4e00-\u9fa5]+.*?[\)\uff09]$')    #用于清除（中文），(小括号)这类的字眼

    name = pattern1.sub('',name,1)    #替换前缀，只需1次
    name = pattern2.sub('',name)  #清除括号及里面的内容，括号内必须得有中文才能清除

    return name

def access_ring_filter(name):      #用于提取网元名中的环路名
    pattern = re.compile(r"R\d{3,4}")      #用于提取网元名中的环路名，只提取接入环名称
    ring = pattern.search(name)
    if ring:
        return ring.group()
    return ring