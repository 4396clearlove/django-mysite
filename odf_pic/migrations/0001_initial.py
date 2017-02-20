# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='labs_table',
            fields=[
                ('Index', models.UUIDField(primary_key=True, default=uuid.uuid4, serialize=False, editable=False, verbose_name='\u7f16\u53f7')),
                ('Name', models.CharField(unique=True, max_length=100, verbose_name='\u673a\u623f\u540d\u79f0')),
                ('UpdateTime', models.DateTimeField(default=datetime.datetime(2017, 2, 5, 14, 38, 21, 399000), verbose_name='\u66f4\u65b0\u65f6\u95f4')),
            ],
        ),
        migrations.CreateModel(
            name='odf_images_table',
            fields=[
                ('Index', models.UUIDField(primary_key=True, default=uuid.uuid4, serialize=False, editable=False, verbose_name='\u7f16\u53f7')),
                ('Image', models.ImageField(upload_to=b'pic_demonstrate/pic', verbose_name='ODF\u56fe\u7247')),
                ('Qrcode', models.ImageField(upload_to=b'pic_demonstrate/qrcode', verbose_name='ODF\u4e8c\u7ef4\u7801')),
                ('Position', models.CharField(max_length=20, verbose_name='\u6240\u5728\u4f4d\u7f6e')),
                ('Lab', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, verbose_name='\u6240\u5c5e\u673a\u623f', to='odf_pic.labs_table')),
            ],
        ),
    ]
