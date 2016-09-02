#-*- coding:utf8 -*-

import os.path
from django.core.management.base import BaseCommand, CommandError
#from tool4db import hw_ipran
from netopo.models import *
from cable.models import *

tableList = [
                'ring',
                'hw_ipran_node',
                'hw_ipran_link',
                'hw_ipran_business_2G',
                'hw_ipran_business_3G_E1',
                'hw_ipran_business_3G_FE',
                'hw_ipran_business_LTE',
                'fh_ipran_node',
                'fh_ipran_toponode',
                'fh_ipran_topolink',
                'fh_ipran_business_2G',
                'fh_ipran_business_3G_E1',
                'fh_ipran_business_3G_FE',
                'fh_ipran_business_LTE',
                'coordinates_table'
            ]

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('-t', 
                            dest = 'table',
                            nargs = '+',
                            choices = tableList
                            )
        parser.add_argument('-a',
                            dest = 'table',   #两个命令都是使用table变量，会互相覆盖
                            const = tableList,
                            action = 'store_const'
                            )

    def handle(self, *args, **options):
        tables = options['table']
        #import pdb;pdb.set_trace()
        for t in tables:
            globals()[t].objects.all().delete()
            self.stdout.write(self.style.HTTP_SUCCESS('Successfully delete "%s" table' % t))