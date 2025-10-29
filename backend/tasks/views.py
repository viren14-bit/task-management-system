from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer


class TaskPermission(permissions.BasePermission):
    """
    Custom permission:
    - Standard users can view all and create tasks
    - Only admins can update and delete tasks
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'POST']:
            return True
        return request.user.is_admin()


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task CRUD operations.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, TaskPermission]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def get_queryset(self):
        queryset = Task.objects.all()
        project_id = self.request.query_params.get('project', None)
        status = self.request.query_params.get('status', None)
        priority = self.request.query_params.get('priority', None)
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if status:
            queryset = queryset.filter(status=status)
        if priority:
            queryset = queryset.filter(priority=priority)
        
        return queryset
