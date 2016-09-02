# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cable', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='coordinates_table',
            name='Color',
            field=models.CharField(max_length=20, null=True, verbose_name='\u56fe\u6807\u989c\u8272', blank=True),
        ),
        migrations.AddField(
            model_name='coordinates_table',
            name='Icon',
            field=models.CharField(max_length=20, null=True, verbose_name='\u56fe\u6807', blank=True),
        ),
    ]
