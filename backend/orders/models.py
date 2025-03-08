from django.db import models
from django.core.validators import MinValueValidator

from accounts.models import User


class DonationOrder(models.Model):

    amount = models.FloatField(validators=[MinValueValidator(0.0)])
    account = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="donations"
    )
    date = models.DateTimeField()
    status = models.CharField(max_length=10)
    stripe_transaction_id = models.TextField()

    def __str__(self):
        return f"{self.account} donated {self.amount} at {self.date}. The transaction is {self.status}"
