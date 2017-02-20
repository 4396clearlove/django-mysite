import sys, os
import StringIO
from django.shortcuts import render_to_response, render
from django.http import HttpResponseRedirect, HttpResponse

from .models import *

sys.path.append(os.path.abspath("tool4db/odf_pic_db_maintance"))
from CopyPicture_v2 import processExcel

# Create your views here.
def odf_image(request, id):
    image = odf_images_table.objects.get(Index=id)
    return render_to_response('odf_pic/test.html', locals())

def update(request):
    if request.method=="POST":
        f1 = request.FILES['file1']
        lab1 = request.POST['lab1']
        f2 = request.FILES['file2']
        lab2 = request.POST['lab2']
        string1 = StringIO.StringIO(f1.read())
        string2 = StringIO.StringIO(f2.read())
        processExcel.delay(string1, lab1)
        processExcel.delay(string2, lab2)
        string1.close()
        string2.close()
        return HttpResponse('success')
    return render(request, 'odf_pic/update.html')