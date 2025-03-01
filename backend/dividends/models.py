from django.db import models

class DividendReceived(models.Model):

    date = models.DateField(auto_now_add=True, editable=False)
    value = models.FloatField(editable=False)

    def __str__(self):
        return f"Dividend amount {self.value} received on {self.date}"
    