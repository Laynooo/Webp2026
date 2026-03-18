from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    photo = models.CharField(max_length=200, blank=True)  # ← 改這行
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)