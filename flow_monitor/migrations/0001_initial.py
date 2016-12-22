# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ring_flow_table',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50, verbose_name='\u73af\u8def\u540d\u79f0')),
                ('down_link_usage', models.FloatField(verbose_name='\u5747\u503c\u5e26\u5bbd\u5229\u7528\u7387')),
                ('down_link_peak_usage', models.FloatField(verbose_name='\u5cf0\u503c\u5e26\u5bbd\u5229\u7528\u7387')),
                ('date', models.DateField(verbose_name='\u65e5\u671f')),
            ],
        ),
    ]
