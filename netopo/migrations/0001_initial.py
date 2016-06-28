# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='fh_ipran_business_2G',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('StationName', models.CharField(max_length=80, verbose_name='\u7ad9\u70b9\u540d\u79f0')),
                ('TransStationName', models.CharField(max_length=80, verbose_name='\u4f20\u8f93\u81ea\u7f16\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='fh_ipran_business_3G_E1',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('StationName', models.CharField(max_length=80, verbose_name='\u7ad9\u70b9\u540d\u79f0')),
                ('TransStationName', models.CharField(max_length=80, verbose_name='\u4f20\u8f93\u81ea\u7f16\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='fh_ipran_business_3G_FE',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('StationName', models.CharField(max_length=80, verbose_name='\u7ad9\u70b9\u540d\u79f0')),
                ('TransStationName', models.CharField(max_length=80, verbose_name='\u4f20\u8f93\u81ea\u7f16\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='fh_ipran_business_LTE',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('StationName', models.CharField(max_length=80, verbose_name='\u7ad9\u70b9\u540d\u79f0')),
                ('TransStationName', models.CharField(max_length=80, verbose_name='\u4f20\u8f93\u81ea\u7f16\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='fh_ipran_node',
            fields=[
                ('NeId', models.IntegerField(serialize=False, verbose_name='\u7f51\u5143\u903b\u8f91ID', primary_key=True)),
                ('NeName', models.CharField(max_length=255, verbose_name='\u7f51\u5143\u540d\u79f0')),
                ('ShortName', models.CharField(max_length=80, null=True, verbose_name='\u4e2d\u6587\u5168\u79f0')),
                ('Type', models.IntegerField(verbose_name='\u7f51\u5143\u7c7b\u578b')),
                ('Ring', models.CharField(max_length=10, null=True, verbose_name='\u6240\u5c5e\u73af\u8def')),
                ('isRoot', models.BooleanField(default=False, verbose_name='\u5e26\u73af\u70b9')),
                ('SelfBusinessAmount', models.IntegerField(null=True, verbose_name='\u81ea\u8eab\u4e0b\u5e26\u4e1a\u52a1\u6570')),
                ('BusinessAmount', models.IntegerField(null=True, verbose_name='\u4e0b\u5e26\u4e1a\u52a1\u6570')),
            ],
        ),
        migrations.CreateModel(
            name='fh_ipran_topolink',
            fields=[
                ('TopoLinkId', models.IntegerField(serialize=False, primary_key=True)),
                ('source', models.CharField(max_length=100, verbose_name='\u6e90\u8282\u70b9')),
                ('dest', models.CharField(max_length=100, verbose_name='\u5bbf\u8282\u70b9')),
                ('Ring', models.CharField(max_length=10, null=True, verbose_name='\u6240\u5c5e\u73af\u8def')),
            ],
        ),
        migrations.CreateModel(
            name='fh_ipran_toponode',
            fields=[
                ('TopoNodeId', models.IntegerField(serialize=False, verbose_name='\u7f51\u5143\u62d3\u6251ID', primary_key=True)),
                ('Neid', models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u7f51\u5143\u903b\u8f91ID', blank=True, to='netopo.fh_ipran_node', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='hw_ipran_business_2G',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('StationName', models.CharField(max_length=80, verbose_name='\u7ad9\u70b9\u540d\u79f0')),
                ('TransStationName', models.CharField(max_length=80, verbose_name='\u4f20\u8f93\u81ea\u7f16\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='hw_ipran_business_3G_E1',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('StationName', models.CharField(max_length=80, verbose_name='\u7ad9\u70b9\u540d\u79f0')),
                ('TransStationName', models.CharField(max_length=80, verbose_name='\u4f20\u8f93\u81ea\u7f16\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='hw_ipran_business_3G_FE',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('StationName', models.CharField(max_length=80, verbose_name='\u7ad9\u70b9\u540d\u79f0')),
                ('TransStationName', models.CharField(max_length=80, verbose_name='\u4f20\u8f93\u81ea\u7f16\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='hw_ipran_business_LTE',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('StationName', models.CharField(max_length=80, verbose_name='\u7ad9\u70b9\u540d\u79f0')),
                ('TransStationName', models.CharField(max_length=80, verbose_name='\u4f20\u8f93\u81ea\u7f16\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='hw_ipran_link',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('source', models.CharField(max_length=80, null=True, verbose_name='\u6e90\u8282\u70b9')),
                ('sport', models.CharField(max_length=30, null=True, verbose_name='\u6e90\u7aef\u53e3')),
                ('dest', models.CharField(max_length=80, null=True, verbose_name='\u5bbf\u8282\u70b9')),
                ('dport', models.CharField(max_length=30, null=True, verbose_name='\u5bbf\u7aef\u53e3')),
                ('ring', models.CharField(max_length=10, null=True, verbose_name='\u6240\u5c5e\u73af\u8def')),
            ],
        ),
        migrations.CreateModel(
            name='hw_ipran_node',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=80, verbose_name='\u7f51\u5143\u540d\u79f0')),
                ('ShortName', models.CharField(max_length=80, null=True, verbose_name='\u4e2d\u6587\u5168\u79f0(\u5305\u542b\u6ce8\u89e3)')),
                ('StationName', models.CharField(max_length=80, verbose_name='\u6240\u5c5e\u7269\u7406\u7ad9\u70b9')),
                ('ip', models.CharField(max_length=20, verbose_name='IP\u5730\u5740')),
                ('node_type', models.CharField(max_length=15, verbose_name='\u7f51\u5143\u7c7b\u578b')),
                ('isRoot', models.BooleanField(default=False, verbose_name='\u5e26\u73af\u70b9')),
                ('SelfBusinessAmount', models.IntegerField(null=True, verbose_name='\u81ea\u8eab\u4e0b\u5e26\u4e1a\u52a1\u6570')),
                ('BusinessAmount', models.IntegerField(null=True, verbose_name='\u4e0b\u5e26\u4e1a\u52a1\u6570')),
                ('Ring', models.CharField(max_length=10, null=True, verbose_name='\u6240\u5c5e\u73af\u8def')),
            ],
        ),
        migrations.CreateModel(
            name='ring',
            fields=[
                ('name', models.CharField(max_length=10, serialize=False, verbose_name='\u73af\u8def\u540d\u79f0', primary_key=True)),
                ('topoStruct', models.TextField(verbose_name='\u73af\u8def\u62d3\u6251')),
                ('ringNodeNum', models.IntegerField(verbose_name='\u73af\u8def\u8282\u70b9\u6570')),
                ('chainNodeNum', models.IntegerField(verbose_name='\u652f\u94fe\u8282\u70b9\u6570')),
            ],
        ),
        migrations.AddField(
            model_name='hw_ipran_business_lte',
            name='Node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u6240\u5c5e\u8282\u70b9', blank=True, to='netopo.hw_ipran_node', null=True),
        ),
        migrations.AddField(
            model_name='hw_ipran_business_3g_fe',
            name='Node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u6240\u5c5e\u8282\u70b9', blank=True, to='netopo.hw_ipran_node', null=True),
        ),
        migrations.AddField(
            model_name='hw_ipran_business_3g_e1',
            name='Node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u6240\u5c5e\u8282\u70b9', blank=True, to='netopo.hw_ipran_node', null=True),
        ),
        migrations.AddField(
            model_name='hw_ipran_business_2g',
            name='Node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u6240\u5c5e\u8282\u70b9', blank=True, to='netopo.hw_ipran_node', null=True),
        ),
        migrations.AddField(
            model_name='fh_ipran_business_lte',
            name='Node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u6240\u5c5e\u8282\u70b9', blank=True, to='netopo.fh_ipran_node', null=True),
        ),
        migrations.AddField(
            model_name='fh_ipran_business_3g_fe',
            name='Node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u6240\u5c5e\u8282\u70b9', blank=True, to='netopo.fh_ipran_node', null=True),
        ),
        migrations.AddField(
            model_name='fh_ipran_business_3g_e1',
            name='Node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u6240\u5c5e\u8282\u70b9', blank=True, to='netopo.fh_ipran_node', null=True),
        ),
        migrations.AddField(
            model_name='fh_ipran_business_2g',
            name='Node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u6240\u5c5e\u8282\u70b9', blank=True, to='netopo.fh_ipran_node', null=True),
        ),
    ]
