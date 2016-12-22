# -*- coding:utf8 -*-
import sys, os
import django
sys.path.append(os.path.abspath("../.."))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite_tz.settings")
django.setup()  # 必须得先设置django启动才能使用model中的删除

import csv

dirPath = u"C:\\Users\\Administrator\\Desktop\\环流量"

def getAverage(listx):
    if listx==[]:
        return 0

    total = 0
    for num in listx:
        total += num
    return total/len(listx)

def main():
    import pdb;pdb.set_trace()

    for root, dirnames, filenames in os.walk(dirPath):
        for filename in filenames:
            print filename
            down_link_usage = []
            down_link_peak_usage = []
            tmpdate = None
            filePath = os.path.join(root, filename)
            reader = csv.reader(file(filePath, 'rb'))
            reader.next()
            for row in reader:
                # print row[0]
                date = row[0][:10]
                if date!=tmpdate:
                    print tmpdate, getAverage(down_link_usage),getAverage(down_link_peak_usage)
                    tmpdate = date
                    down_link_usage = []
                    down_link_peak_usage = []
                else:
                    if row[4]=='':
                        down_link_usage.append(0)
                    else:
                        down_link_usage.append(float(row[4]))
                    if row[8]=='':
                        down_link_peak_usage.append(0)
                    else:
                        down_link_peak_usage.append(float(row[8]))
                # try:
                #     down_link_usage.append(float(row[4]))
                #     down_link_peak_usage.append(float(row[8]))
                # except ValueError, e:
                #     print e
                #     down_link_usage.append(0)
                #     down_link_peak_usage.append(0)
                #     break
            print tmpdate, getAverage(down_link_usage),getAverage(down_link_peak_usage)
            # down_link_usage = []
            # down_link_peak_usage = []
            # tmpdate = None

if __name__ == '__main__':
    main()