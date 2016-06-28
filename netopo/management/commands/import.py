#-*- coding:utf8 -*-import os
import os.path
from django.core.management.base import BaseCommand, CommandError
from tool4db import hw_ipran, fh_ipran

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('table', type=str)

    def handle(self, *args, **options):
        table = options['table']
        if table=='hw_ipran_ring':
            hw_ipran.import_ring()
        elif table=='hw_ipran_node':
            hw_ipran.import_node()
        elif table=='hw_ipran_link':
            hw_ipran.import_link()
        elif table=='hw_ipran_business':
            hw_ipran.import_business()
            #hw_ipran.update_node_business_amount()
        elif table=='fh_ipran_node_link':
            fh_ipran.import_all()

        elif table=='fh_ipran_business':
            fh_ipran.import_business()
