# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('odf_pic', '0002_auto_20170206_1058'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labs_table',
            name='UpdateTime',
            field=models.DateTimeField(default=datetime.datetime(2017, 2, 6, 22, 16, 43, 819000), verbose_name='\u66f4\u65b0\u65f6\u95f4'),
        ),
    ]
