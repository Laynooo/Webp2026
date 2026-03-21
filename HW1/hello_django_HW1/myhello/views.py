import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

# 同時匯入原本的 Post 和作業要求的 Course_table
from .models import Post, Course_table

# 設定 Logger
logger = logging.getLogger('django')

# ==========================================
# 1. 課程管理系統 (HW#1 作業要求部分)
# ==========================================

@api_view(['GET'])
def addcourse(request):
    """
    作業要求：加入課程 API
    測試網址範例：/myhello/addcourse?Department=資工系&CourseTitle=生物統計&Instructor=陳光武
    """
    dept = request.GET.get('Department', '')
    title = request.GET.get('CourseTitle', '')
    teacher = request.GET.get('Instructor', '')

    if title:
        # 存入 Course_table
        new_course = Course_table(
            Department=dept, 
            CourseTitle=title, 
            Instructor=teacher
        )
        new_course.save()
        logger.debug(f"課程 {title} 插入成功")
        return Response({"message": f"課程 {title} 已成功加入！"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "請提供 CourseTitle 參數"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def courselist(request):
    """
    作業要求：回傳課程列表 API
    測試網址：/myhello/courselist
    """
    courses = Course_table.objects.all().values()
    return Response(list(courses), status=status.HTTP_200_OK)


# ==========================================
# 2. 原本的 Post 範例 (保留供參考)
# ==========================================

@api_view(['GET'])
def add_post(request):
    title = request.GET.get('title', '')
    content = request.GET.get('content', '')
    photo = request.GET.get('photo', '')
    location = request.GET.get('location', '')

    new_post = Post(
        title=title,
        content=content,
        photo=photo,
        location=location
    )
    new_post.save()

    if title:
        return Response({"data": f"{title} insert!"}, status=status.HTTP_200_OK)
    else:
        return Response({"res": "parameter: title is None"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_post(request):
    posts = Post.objects.all().values()
    return Response(list(posts), status=status.HTTP_200_OK)