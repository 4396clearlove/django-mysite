# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('netopo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='hw_ipran_link',
            name='isDelete',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426\u79fb\u9664'),
        ),
    ]
