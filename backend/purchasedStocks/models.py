from django.db import models
import uuid # for ID

from stock.models import Stock # for foreign key

# Create your models here.
class PurchasedStock(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='purchased_stocks')
    stock_amount = models.DecimalField(max_digits=10, decimal_places=2)
    stock_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField()

    def __str__(self):
        return f"{self.stock.symbol}: {self.stock_amount} at {self.stock_price} on {self.purchase_date}"

    class Meta:
        ordering = ['-purchase_date'] # sort descending, latest purchase first