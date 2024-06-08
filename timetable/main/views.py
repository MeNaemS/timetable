from django.http import JsonResponse, FileResponse, HttpResponse, Http404
from django.utils.datastructures import MultiValueDictKeyError
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_protect
from django.core.files.base import ContentFile
from django.shortcuts import render
from django.conf import settings
from .models import TimeTable
from os.path import join
from json import loads
from os import listdir

dir: list[str] = listdir(join(settings.MEDIA_ROOT, 'images'))


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
            'dir': dir
        }
    )

# Create your views here.
@csrf_protect
def index(request):
    if (request.method == 'POST'):
        try:
            if (f"{request.POST.get('filename')}.jpg" not in dir):
                path = default_storage.save(f'images/{request.POST.get('filename')}.jpg', ContentFile(request.FILES['file'].read()))
                path = join(settings.MEDIA_ROOT, path)
                return render_main_page(request)
        except MultiValueDictKeyError:
            return JsonResponse({'ok': False})
    elif (request.method == 'PUT'):
        filename = f"{loads(request.body)['id']}.jpg"
        if (not loads(request.body)['catch']):
            return JsonResponse(
                {'ok': True, 'image_path': True if (filename in dir) else False}
            )
        return FileResponse(open(join(settings.MEDIA_ROOT, 'images', filename), 'rb'))
    return render_main_page(request)
