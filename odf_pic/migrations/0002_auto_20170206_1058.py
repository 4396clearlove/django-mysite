# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('odf_pic', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labs_table',
            name='UpdateTime',
            field=models.DateTimeField(default=datetime.datetime(2017, 2, 6, 10, 58, 30, 941000), verbose_name='\u66f4\u65b0\u65f6\u95f4'),
        ),
    ]
