from django.http import JsonResponse, FileResponse, HttpResponse, HttpResponsePermanentRedirect
from django.utils.datastructures import MultiValueDictKeyError
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_protect
from django.core.files.base import ContentFile
from django.shortcuts import render
from django.conf import settings
from os import listdir, makedirs
from os.path import join, isdir, splitext
from .models import TimeTable
from json import loads


def render_main_page(request) -> HttpResponse:
    rows = TimeTable.objects.all()
    return render(
        request,
        'main/index.html',
        {   
            "rows": rows,
            "months": [
                "Январь", "Февраль", "Март",
                "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь",
                "Октябрь", "Ноябрь", "Декабрь"
            ],
            'dir': '|'.join([item[0] for item in map(splitext, listdir(join(settings.MEDIA_ROOT, 'images')))])
        }
    )

# Create your views here.
@csrf_protect
def index(request):
    if (not isdir(join(settings.MEDIA_ROOT, 'images'))):
        makedirs(join(settings.MEDIA_ROOT, 'images'))
    dir: list[str] = listdir(join(settings.MEDIA_ROOT, 'images'))
    if (request.method == 'POST'):
        try:
            if (f"{request.POST.get('filename')}.jpg" not in dir):
                path = default_storage.save(f'images/{request.POST.get('filename')}.jpg', ContentFile(request.FILES['file'].read()))
                path = join(settings.MEDIA_ROOT, path)
                return HttpResponsePermanentRedirect("/")
        except MultiValueDictKeyError:
            return HttpResponsePermanentRedirect("/")
    elif (request.method == 'PUT'):
        filename = f"{loads(request.body)['id']}.jpg"
        if (not loads(request.body)['catch']):
            return JsonResponse(
                {'ok': True, 'image_path': True if (filename in dir) else False}
            )
        return FileResponse(open(join(settings.MEDIA_ROOT, 'images', filename), 'rb'))
    return render_main_page(request)
