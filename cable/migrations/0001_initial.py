# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='coordinates_table',
            fields=[
                ('Name', models.CharField(max_length=100, verbose_name='\u6807\u8bc6\u540d\u79f0')),
                ('Description', models.TextField(null=True, verbose_name='\u63cf\u8ff0', blank=True)),
                ('Coordinates', models.TextField(null=True, verbose_name='\u5750\u6807\u96c6', blank=True)),
                ('BMPoints', models.TextField(null=True, verbose_name='\u767e\u5ea6\u5750\u6807\u96c6', blank=True)),
                ('StartPoint', models.CharField(max_length=100, null=True, verbose_name='\u8d77\u70b9\u540d\u79f0', blank=True)),
                ('EndPoint', models.CharField(max_length=100, null=True, verbose_name='\u7ec8\u70b9\u540d\u79f0', blank=True)),
                ('Type', models.IntegerField(verbose_name='\u7c7b\u578b')),
                ('Level', models.IntegerField(null=True, verbose_name='\u6811\u5c42\u7ea7', blank=True)),
                ('ParentIdent', models.CharField(max_length=30, null=True, verbose_name='\u7236\u8282\u70b9\u6807\u8bc6', blank=True)),
                ('ElementIdent', models.CharField(max_length=30, serialize=False, verbose_name='\u8282\u70b9\u552f\u4e00\u6807\u8bc6', primary_key=True)),
            ],
        ),
    ]
