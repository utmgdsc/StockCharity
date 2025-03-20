from django.db import models


class BankAccount(models.Model):
    name = models.TextField(max_length=150)
    balance = models.FloatField(default=0)


class Transaction(models.Model):
    bank_account = models.ForeignKey(
        BankAccount, on_delete=models.CASCADE, related_name="transactions"
    )
    amount = models.FloatField()  # Positive is credit and negative is debit
