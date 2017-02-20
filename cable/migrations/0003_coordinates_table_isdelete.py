# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cable', '0002_auto_20160705_1333'),
    ]

    operations = [
        migrations.AddField(
            model_name='coordinates_table',
            name='IsDelete',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426\u79fb\u9664'),
        ),
    ]
