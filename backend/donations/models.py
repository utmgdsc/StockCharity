from django.db import models
import uuid # for ID

from charities.models import Charity  # for foreign key

# Create your models here.
class Donation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    charity = models.ForeignKey(Charity, on_delete=models.CASCADE, related_name='donations') # this allows charity.donations.all()
    donation_amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateField()

    def __str__(self):
        return f"{self.charity.name}: {self.donation_amount} on {self.donation_date}"

    class Meta:
        ordering = ['-donation_date'] # sort descending, latest donations first