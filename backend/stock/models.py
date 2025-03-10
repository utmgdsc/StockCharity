from django.db import models

class Stock(models.Model):
    stock_name = models.CharField(max_length=255)
    symbol = models.CharField(max_length=10, unique=True)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.stock_name} ({self.symbol}): {self.quantity}"