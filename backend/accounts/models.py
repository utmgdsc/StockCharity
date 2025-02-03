from django.db import models
from django.contrib.auth import get_user_model


class Account(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
