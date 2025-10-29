from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'priority', 'status', 'due_date', 'created_by']
    list_filter = ['priority', 'status', 'project', 'created_at']
    search_fields = ['title', 'description']
    date_hierarchy = 'due_date'
