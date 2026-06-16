from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TripInputSerializer
from .eld_engine import TripEngine


class PlanTripView(APIView):
    def post(self, request):
        serializer = TripInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        def _coords(lat_key, lng_key):
            lat = data.get(lat_key)
            lng = data.get(lng_key)
            if lat is not None and lng is not None:
                return (lat, lng)
            return None

        try:
            engine = TripEngine(
                current_location=data['current_location'],
                pickup_location=data['pickup_location'],
                dropoff_location=data['dropoff_location'],
                cycle_hours_used=data['cycle_hours_used'],
                current_coords=_coords('current_lat', 'current_lng'),
                pickup_coords=_coords('pickup_lat', 'pickup_lng'),
                dropoff_coords=_coords('dropoff_lat', 'dropoff_lng'),
            )
            result = engine.plan_trip()
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e), 'detail': 'Trip planning failed. Please check your inputs and try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
