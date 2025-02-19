from django.db import models


# Place holder until we get the actual account class added.
class Account():
    def __init__(self):
        self.just_testing = 0


class Donation_order(models.Model):

    donation_total = models.FloatField()
    account = models.IntegerField()
    # account = models.ForeignKey('Account', on_delete=models.CASCADE) #uncomment once accounts are setup
    time = models.DateTimeField()
    status = models.CharField(max_length=10)
    stripe_transaction_id = models.TextField()


    def __str__(self):
        return (self.account, "donated", f'{self.donation_total}', "at", self.time, 
                ". The transaction is", self.status)
                