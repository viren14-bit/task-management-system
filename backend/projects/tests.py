from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Project

User = get_user_model()


class ProjectModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
    
    def test_create_project(self):
        project = Project.objects.create(
            name='Test Project',
            description='Test Description',
            created_by=self.user
        )
        self.assertEqual(project.name, 'Test Project')
        self.assertEqual(project.created_by, self.user)


class ProjectAPITest(TestCase):
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
        self.url = '/api/projects/'
    
    def test_list_projects_authenticated(self):
        self.client.force_authenticate(user=self.standard_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_list_projects_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_project_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'New Project', 'description': 'New Description'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_project_as_standard_user(self):
        self.client.force_authenticate(user=self.standard_user)
        data = {'name': 'New Project', 'description': 'New Description'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_update_project_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'Updated Project'}
        response = self.client.patch(f'{self.url}{self.project.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_delete_project_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'{self.url}{self.project.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
