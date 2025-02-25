from django.db import models
import uuid # for ID

# Create your models here.
class Donation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    charity_name = models.CharField(max_length=255)
    donation_amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateField()

    def __str__(self):
        return f"{self.charity_name}: {self.amount} on {self.donation_date}"

    class Meta:
        ordering = ['-donation_date'] # sort descending, latest donations first