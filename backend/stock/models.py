from django.db import models

class Stock(models.Model):
    stock_name = models.CharField(max_length=255)
    symbol = models.CharField(max_length=10, unique=True)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.stock_name} ({self.symbol}): {self.quantity}"

class StockInfo(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    last_update = models.DateField(blank=True, null=True)

class StockInfoEntry(models.Model):
    stock = models.ForeignKey(StockInfo, on_delete=models.CASCADE, related_name="entries")
    date = models.DateField()
    price = models.FloatField()
    dividend = models.FloatField()
    split = models.FloatField()

    class Meta:
        indexes = [
            models.Index(fields=["stock", "date"])
        ]