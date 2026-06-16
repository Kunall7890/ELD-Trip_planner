from django.db import models

class Trip(models.Model):
    current_location = models.CharField(max_length=500)
    pickup_location = models.CharField(max_length=500)
    dropoff_location = models.CharField(max_length=500)
    cycle_hours_used = models.FloatField(help_text="Hours already used in current 70hr/8day cycle")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.current_location} -> {self.pickup_location} -> {self.dropoff_location}"
