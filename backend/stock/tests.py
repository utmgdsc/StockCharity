from django.test import TestCase
from .models import Stock

class StockModelTest(TestCase):

    def setUp(self):
        """Set up initial test data"""
        self.stock = Stock.objects.create(stock_name="Apple Inc.", symbol="AAPL", quantity=100)

    def test_stock_creation(self):
        """Test if a stock instance is correctly created"""
        self.assertEqual(self.stock.stock_name, "Apple Inc.")
        self.assertEqual(self.stock.symbol, "AAPL")
        self.assertEqual(self.stock.quantity, 100)

    def test_stock_str_method(self):
        """Test the __str__ method of Stock model"""
        self.assertEqual(str(self.stock), "Apple Inc. (AAPL): 100")

    def test_stock_symbol_uniqueness(self):
        """Test that stock symbols must be unique"""
        with self.assertRaises(Exception):
            Stock.objects.create(stock_name="Amazon", symbol="AAPL", quantity=50)

    def test_stock_quantity_default(self):
        """Test default quantity is set to 0 if not provided"""
        new_stock = Stock.objects.create(stock_name="Tesla", symbol="TSLA")
        self.assertEqual(new_stock.quantity, 0)

    def test_stock_update(self):
        """Test updating an existing stock"""
        self.stock.stock_name = "Apple Corporation"
        self.stock.quantity = 150
        self.stock.save()
        updated_stock = Stock.objects.get(symbol="AAPL")
        self.assertEqual(updated_stock.stock_name, "Apple Corporation")
        self.assertEqual(updated_stock.quantity, 150)

    def test_stock_deletion(self):
        """Test deleting a stock"""
        self.stock.delete()
        with self.assertRaises(Stock.DoesNotExist):
            Stock.objects.get(symbol="AAPL")
