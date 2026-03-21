from django.db import models

# Create your models here.

from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    photo = models.URLField(blank=True)
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


class Course_table(models.Model):
    Department = models.CharField(max_length=100) # 開課單位
    CourseTitle = models.CharField(max_length=100) # 課程名稱
    Instructor = models.CharField(max_length=100)  # 授課老師

    def __str__(self):
        return self.CourseTitle