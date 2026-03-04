from django.contrib import admin
from django.urls import path
from django.http import HttpResponse # 必須匯入
import logging # 匯入 Logger

logger = logging.getLogger('django')

def myhello(request):
    name = request.GET.get('name', 'CGU')
    logger.info(f"myhello API 被呼叫了，name={name}")
    return HttpResponse(f"Hello {name}")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('myhello/', myhello), # 這一行就是讓網址認得 /myhello/ 的關鍵
]