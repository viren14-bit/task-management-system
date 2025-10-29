from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, timedelta
from .models import Task
from projects.models import Project

User = get_user_model()


class TaskModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.project = Project.objects.create(
            name='Test Project',
            created_by=self.user
        )
    
    def test_create_task(self):
        task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            due_date=date.today() + timedelta(days=7),
            priority='high',
            status='todo',
            project=self.project,
            created_by=self.user
        )
        self.assertEqual(task.title, 'Test Task')
        self.assertEqual(task.priority, 'high')
        self.assertEqual(task.project, self.project)


class TaskAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.standard_user = User.objects.create_user(
            username='standard',
            password='pass123',
            role='standard'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            password='pass123',
            role='admin'
        )
        self.project = Project.objects.create(
            name='Test Project',
            created_by=self.admin_user
        )
        self.task = Task.objects.create(
            title='Test Task',
            due_date=date.today() + timedelta(days=7),
            project=self.project,
            created_by=self.admin_user
        )
        self.url = '/api/tasks/'
    
    def test_list_tasks_authenticated(self):
        self.client.force_authenticate(user=self.standard_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_task_as_standard_user(self):
        self.client.force_authenticate(user=self.standard_user)
        data = {
            'title': 'New Task',
            'description': 'New Description',
            'due_date': str(date.today() + timedelta(days=7)),
            'priority': 'medium',
            'status': 'todo',
            'project': self.project.id
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_update_task_as_standard_user(self):
        self.client.force_authenticate(user=self.standard_user)
        data = {'title': 'Updated Task'}
        response = self.client.patch(f'{self.url}{self.task.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_update_task_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {'title': 'Updated Task'}
        response = self.client.patch(f'{self.url}{self.task.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_delete_task_as_standard_user(self):
        self.client.force_authenticate(user=self.standard_user)
        response = self.client.delete(f'{self.url}{self.task.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_delete_task_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'{self.url}{self.task.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_filter_tasks_by_project(self):
        self.client.force_authenticate(user=self.standard_user)
        response = self.client.get(f'{self.url}?project={self.project.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_filter_tasks_by_status(self):
        self.client.force_authenticate(user=self.standard_user)
        response = self.client.get(f'{self.url}?status=todo')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
