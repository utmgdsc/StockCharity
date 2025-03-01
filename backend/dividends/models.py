from django.db import models
from datetime import date

class DividendReceived(models.Model):

    date = models.DateField(default=date.today)
    value = models.FloatField()

    def __str__(self):
        return f"Dividend amount {self.value} received on {self.date}"
    