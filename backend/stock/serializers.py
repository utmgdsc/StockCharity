from datetime import datetime

from rest_framework import serializers

from .models import Stock, StockInfoEntry


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"


class StockInfoEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = StockInfoEntry
        fields = "__all__"

    def to_internal_value(self, data):
        if "stock" not in data and "stock" in self.context:
            data["stock"] = self.context["stock"]
        # Convert the date time stamp
        if "date" not in data:
            raise serializers.ValidationError("Missing date field")
        data["date"] = datetime.date(datetime.fromisoformat(data["date"][:-1]))
        # Re-organize some entry naming inconsistencies
        map = {"divCash": "dividend", "splitFactor": "split", "close": "price"}
        for oldName, newName in map.items():
            if oldName in data:
                if newName in data:
                    raise serializers.ValidationError(
                        f"Attributes contains both {oldName} and {newName}."
                    )
                else:
                    data[newName] = data[oldName]
                    del data[oldName]
        return super().to_internal_value(data)
