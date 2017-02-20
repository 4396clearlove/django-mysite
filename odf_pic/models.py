#-*- coding:utf8 -*-

from django.db import models
import uuid
from django.utils import timezone

class labs_table(models.Model):
    Index = models.UUIDField(u"编号", primary_key=True, default=uuid.uuid4, editable=False)
    Name = models.CharField(u"机房名称", unique=True, max_length=100)
    UpdateTime = models.DateTimeField(u"更新时间", default=timezone.now())


class odf_images_table(models.Model):
    Index = models.UUIDField(u"编号", primary_key=True, default=uuid.uuid4, editable=False)
    Image = models.ImageField(u"ODF图片", upload_to="pic_demonstrate/pic")
    Qrcode = models.ImageField(u"ODF二维码", upload_to="pic_demonstrate/qrcode")
    Lab = models.ForeignKey(
                        labs_table,
                        on_delete = models.PROTECT,
                        verbose_name = u"所属机房"
        )
    Position = models.CharField(u"所在位置", max_length=20)