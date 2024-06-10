from django.views.decorators.csrf import csrf_protect
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render
from django.conf import settings
from os.path import join, isfile
from json import loads, dump
from os import makedirs


def add_file(path: str, name: str, data):
    try:
        with open(join(path, name), 'x' if (not isfile(join(path, name))) else 'a', encoding='utf-8') as file:
            dump(data, file, indent=4)
    except FileNotFoundError:
        makedirs(path)
        add_file(path, name, data)


# Create your views here.
@csrf_protect
def handler_403(request, exception):
    if request.method == 'POST':
        add_file(join(settings.MEDIA_ROOT, 'error'), '403.json', loads(request.body))
    return render(request, 'system/403.html', {'error': exception})


def handler_404(request, exception):
    return render(request, 'system/404.html')


@csrf_protect
def handler_500(request):
    from sys import exc_info

    print(exc_info())
    try:
        if request.method == 'POST':
            add_file(join(settings.MEDIA_ROOT, 'error'), '500.json', loads(request.body))
        return render(request, 'system/500.html', {'error': str(exc_info()[1])})
    except:
        return render(request, 'system/500.html', {'error': str(exc_info()[1])})
