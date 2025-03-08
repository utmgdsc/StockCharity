from datetime import date

from django.db import models
from django.core.validators import MinValueValidator


class DividendReceived(models.Model):

    date = models.DateField(default=date.today)
    value = models.FloatField(validators=[MinValueValidator(0.0)])

    def __str__(self):
        return f"Dividend amount {self.value} received on {self.date}"
