from rest_framework import serializers


class TripInputSerializer(serializers.Serializer):
    current_location = serializers.CharField(max_length=500, allow_blank=False)
    pickup_location = serializers.CharField(max_length=500, allow_blank=False)
    dropoff_location = serializers.CharField(max_length=500, allow_blank=False)
    current_lat = serializers.FloatField(required=False, min_value=-90, max_value=90)
    current_lng = serializers.FloatField(required=False, min_value=-180, max_value=180)
    pickup_lat = serializers.FloatField(required=False, min_value=-90, max_value=90)
    pickup_lng = serializers.FloatField(required=False, min_value=-180, max_value=180)
    dropoff_lat = serializers.FloatField(required=False, min_value=-90, max_value=90)
    dropoff_lng = serializers.FloatField(required=False, min_value=-180, max_value=180)
    cycle_hours_used = serializers.FloatField(min_value=0, max_value=70)
