from django.urls import path
from . import views

urlpatterns = [
    # 原本有的
    path('add', views.add_post, name='add_post'),
    path('list', views.list_post, name='list_post'),
    
    # --- 請新增下面這兩行 ---
    path('addcourse', views.addcourse, name='addcourse'),
    path('courselist', views.courselist, name='courselist'),
]