from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model with role-based access.
    """
    ROLE_CHOICES = [
        ('standard', 'Standard User'),
        ('admin', 'Administrator'),
    ]
    
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='standard'
    )
    
    def is_admin(self):
        return self.role == 'admin' or self.is_superuser
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
