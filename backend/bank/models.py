from django.db import models
from django.contrib.auth import get_user_model

class Donation(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    value = models.FloatField()

class Stock(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    value = models.FloatField()
    symbol = models.CharField(max_length=8)
    quantity = models.IntegerField()
