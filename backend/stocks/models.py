from django.db import models
import uuid # for ID

# Create your models here.
class Stock(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stock_symbol = models.CharField(max_length=255) # this should be a foreign key to a stock
    stock_amount = models.DecimalField(max_digits=10, decimal_places=2)
    stock_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField()

    def __str__(self):
        return f"{self.stock_symbol}: {self.stock_amount} at {self.stock_price} on {self.purchase_date}"

    class Meta:
        ordering = ['-purchase_date'] # sort descending, latest purchase first