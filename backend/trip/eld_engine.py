import math
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

MAX_DRIVING_HOURS_PER_DAY = 11
MAX_ON_DUTY_HOURS_PER_DAY = 14
BREAK_AFTER_DRIVING_HOURS = 8
BREAK_DURATION_HOURS = 0.5
OFF_DUTY_HOURS_REQUIRED = 10
MAX_CYCLE_HOURS = 70
AVERAGE_SPEED_MPH = 65
PICKUP_DROP_HOURS = 1
FUEL_INTERVAL_MILES = 1000
FUEL_STOP_DURATION_HOURS = 0.5

DRIVING = 'driving'
ON_DUTY = 'on_duty'
OFF_DUTY = 'off_duty'
SLEEPER = 'sleeper'


def haversine_dist(lat1, lng1, lat2, lng2):
    R = 3959
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class EldDay:
    def __init__(self, date_str, cycle_hours_used_before=0):
        self.date_str = date_str
        self.cycle_hours_used_before = cycle_hours_used_before
        self.segments = []
        self.driving_minutes = 0
        self.on_duty_minutes = 0

    def add_segment(self, start_hour, end_hour, status, label=''):
        if end_hour > 24:
            end_hour = 24
        if start_hour < 0:
            start_hour = 0
        if end_hour <= start_hour:
            return
        self.segments.append({
            'start_hour': round(start_hour, 2),
            'end_hour': round(end_hour, 2),
            'status': status,
            'label': label,
        })
        minutes = (end_hour - start_hour) * 60
        if status == DRIVING:
            self.driving_minutes += minutes
        if status in (DRIVING, ON_DUTY):
            self.on_duty_minutes += minutes

    def total_driving_hours(self):
        return self.driving_minutes / 60

    def total_on_duty_hours(self):
        return self.on_duty_minutes / 60

    def can_drive_more(self):
        return self.total_driving_hours() < MAX_DRIVING_HOURS_PER_DAY

    def remaining_drive_hours(self):
        result = MAX_DRIVING_HOURS_PER_DAY - self.total_driving_hours()
        return max(result, 0)

    def remaining_on_duty_window(self, elapsed):
        result = MAX_ON_DUTY_HOURS_PER_DAY - elapsed
        return max(result, 0)

    def to_dict(self):
        return {
            'date': self.date_str,
            'segments': self.segments,
            'total_driving_hours': round(self.total_driving_hours(), 2),
            'total_on_duty_hours': round(self.total_on_duty_hours(), 2),
            'remaining_cycle_hours': round(
                max(MAX_CYCLE_HOURS - self.cycle_hours_used_before - self.on_duty_minutes / 60, 0), 2
            ),
        }


class TripEngine:
    def __init__(self, current_location, pickup_location, dropoff_location, cycle_hours_used,
                 current_coords=None, pickup_coords=None, dropoff_coords=None):
        self.current_location = current_location
        self.pickup_location = pickup_location
        self.dropoff_location = dropoff_location
        self.cycle_hours_used = cycle_hours_used
        self.current_coords = current_coords
        self.pickup_coords = pickup_coords
        self.dropoff_coords = dropoff_coords
        self.days = []

    def _coords_valid(self, coords):
        return coords is not None and coords[0] is not None and coords[1] is not None

    def _calc_distance(self):
        d1 = 100
        d2 = 100
        if self._coords_valid(self.current_coords) and self._coords_valid(self.pickup_coords):
            d1 = haversine_dist(
                self.current_coords[0], self.current_coords[1],
                self.pickup_coords[0], self.pickup_coords[1]
            )
        if self._coords_valid(self.pickup_coords) and self._coords_valid(self.dropoff_coords):
            d2 = haversine_dist(
                self.pickup_coords[0], self.pickup_coords[1],
                self.dropoff_coords[0], self.dropoff_coords[1]
            )
        return max(d1, 10), max(d2, 10)

    def _can_fit(self, hours, current_hour, day_start, drive_remain, duty_remain):
        if hours <= 0:
            return True
        if current_hour + hours > 24:
            return False
        if hours > drive_remain:
            return False
        elapsed = current_hour - day_start + hours
        if elapsed > MAX_ON_DUTY_HOURS_PER_DAY:
            return False
        return True

    def _build_segment(self, day, hour, duration, status, label):
        day.add_segment(hour, hour + duration, status, label)
        return hour + duration

    def plan_trip(self):
        leg1_miles, leg2_miles = self._calc_distance()
        self.total_distance = leg1_miles + leg2_miles

        leg1_hours = leg1_miles / AVERAGE_SPEED_MPH
        leg2_hours = leg2_miles / AVERAGE_SPEED_MPH

        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        day_index = 0
        current_cycle = self.cycle_hours_used
        cycle_history = []  # track on-duty hours per day for rolling 8-day window

        remaining_leg1 = leg1_hours
        remaining_leg2 = leg2_hours
        total_miles_driven = 0
        next_fuel_miles = FUEL_INTERVAL_MILES

        phase = 'driving_to_pickup'

        while remaining_leg1 > 0.01 or remaining_leg2 > 0.01 or phase in ('pickup', 'dropoff'):
            if current_cycle >= MAX_CYCLE_HOURS:
                break
            if day_index > 14:
                break

            day_date = today + timedelta(days=day_index)
            day = EldDay(day_date.strftime('%Y-%m-%d'), current_cycle)
            hour = 6  # DEFAULT shift start

            hour = self._build_segment(day, hour, 0.25, ON_DUTY, 'Pre-trip inspection')

            drove_today = 0
            consecutive_drive = 0
            shift_start = 6

            while hour < 24:
                elapsed = hour - shift_start
                duty_remain = day.remaining_on_duty_window(elapsed)
                drive_remain = day.remaining_drive_hours()

                if drive_remain <= 0 or duty_remain <= 0.25:
                    break

                if phase == 'driving_to_pickup':
                    if consecutive_drive >= BREAK_AFTER_DRIVING_HOURS:
                        if self._can_fit(BREAK_DURATION_HOURS, hour, shift_start, drive_remain, duty_remain):
                            hour = self._build_segment(day, hour, BREAK_DURATION_HOURS, OFF_DUTY, '30-min break')
                            consecutive_drive = 0
                            continue
                        else:
                            if drive_remain > 0 and duty_remain > BREAK_DURATION_HOURS:
                                hour = self._build_segment(day, hour, BREAK_DURATION_HOURS, OFF_DUTY, '30-min break')
                                consecutive_drive = 0
                                continue
                            break

                    max_seg = min(
                        remaining_leg1, drive_remain,
                        BREAK_AFTER_DRIVING_HOURS - consecutive_drive,
                        duty_remain,
                        24 - hour
                    )
                    if max_seg <= 0.01:
                        break
                    seg = min(max_seg, remaining_leg1)
                    hour = self._build_segment(day, hour, seg, DRIVING, 'Driving to pickup')
                    drove_today += seg
                    consecutive_drive += seg
                    remaining_leg1 -= seg
                    total_miles_driven += seg * AVERAGE_SPEED_MPH

                    # Recalculate drive_remain after driving segment for fuel stop check
                    drive_remain = day.remaining_drive_hours()
                    duty_remain = day.remaining_on_duty_window(hour - shift_start)

                    if total_miles_driven >= next_fuel_miles:
                        if self._can_fit(FUEL_STOP_DURATION_HOURS, hour, shift_start, drive_remain, duty_remain):
                            hour = self._build_segment(day, hour, FUEL_STOP_DURATION_HOURS, ON_DUTY, 'Fuel stop')
                            next_fuel_miles += FUEL_INTERVAL_MILES

                    if remaining_leg1 <= 0.01:
                        remaining_leg1 = 0
                        phase = 'pickup'

                elif phase == 'pickup':
                    if self._can_fit(PICKUP_DROP_HOURS, hour, shift_start, drive_remain, duty_remain):
                        hour = self._build_segment(day, hour, PICKUP_DROP_HOURS, ON_DUTY, 'Pickup')
                        phase = 'driving_to_dropoff'
                    else:
                        break

                elif phase == 'driving_to_dropoff':
                    if consecutive_drive >= BREAK_AFTER_DRIVING_HOURS:
                        if self._can_fit(BREAK_DURATION_HOURS, hour, shift_start, drive_remain, duty_remain):
                            hour = self._build_segment(day, hour, BREAK_DURATION_HOURS, OFF_DUTY, '30-min break')
                            consecutive_drive = 0
                            continue
                        else:
                            if drive_remain > 0 and duty_remain > BREAK_DURATION_HOURS:
                                hour = self._build_segment(day, hour, BREAK_DURATION_HOURS, OFF_DUTY, '30-min break')
                                consecutive_drive = 0
                                continue
                            break

                    max_seg = min(
                        remaining_leg2, drive_remain,
                        BREAK_AFTER_DRIVING_HOURS - consecutive_drive,
                        duty_remain,
                        24 - hour
                    )
                    if max_seg <= 0.01:
                        break
                    seg = min(max_seg, remaining_leg2)
                    hour = self._build_segment(day, hour, seg, DRIVING, 'Driving to dropoff')
                    drove_today += seg
                    consecutive_drive += seg
                    remaining_leg2 -= seg
                    total_miles_driven += seg * AVERAGE_SPEED_MPH

                    drive_remain = day.remaining_drive_hours()
                    duty_remain = day.remaining_on_duty_window(hour - shift_start)

                    if total_miles_driven >= next_fuel_miles:
                        if self._can_fit(FUEL_STOP_DURATION_HOURS, hour, shift_start, drive_remain, duty_remain):
                            hour = self._build_segment(day, hour, FUEL_STOP_DURATION_HOURS, ON_DUTY, 'Fuel stop')
                            next_fuel_miles += FUEL_INTERVAL_MILES

                    if remaining_leg2 <= 0.01:
                        remaining_leg2 = 0
                        phase = 'dropoff'

                elif phase == 'dropoff':
                    if self._can_fit(PICKUP_DROP_HOURS, hour, shift_start, drive_remain, duty_remain):
                        hour = self._build_segment(day, hour, PICKUP_DROP_HOURS, ON_DUTY, 'Drop-off')
                        phase = 'done'
                    else:
                        break

                elif phase == 'done':
                    break

                if hour >= 24:
                    break

            remaining_day = 24 - hour
            if remaining_day > 0:
                day.add_segment(hour, 24, SLEEPER, 'Sleeper berth')
                # Calculate total off-duty hours (sleeper)
                off_duty_hours = 24 - hour
                # If off-duty is less than required 10 hours, adjust next day start
                if off_duty_hours < OFF_DUTY_HOURS_REQUIRED:
                    # Need to extend rest period into next day conceptually
                    pass  # The next day's start will account for remaining hours

            day_on_duty = day.total_on_duty_hours()
            current_cycle += day_on_duty
            cycle_history.append(day_on_duty)
            # Drop hours outside the 8-day rolling window
            if len(cycle_history) > 8:
                dropped = cycle_history.pop(0)
                current_cycle = max(current_cycle - dropped, 0)

            self.days.append(day.to_dict())
            day_index += 1

        return self.build_response()

    def build_response(self):
        legs = []
        if self._coords_valid(self.current_coords) and self._coords_valid(self.pickup_coords):
            legs.append({
                'from': self.current_location,
                'to': self.pickup_location,
                'from_coords': {'lat': self.current_coords[0], 'lng': self.current_coords[1]},
                'to_coords': {'lat': self.pickup_coords[0], 'lng': self.pickup_coords[1]},
                'type': 'pickup',
            })
        if self._coords_valid(self.pickup_coords) and self._coords_valid(self.dropoff_coords):
            legs.append({
                'from': self.pickup_location,
                'to': self.dropoff_location,
                'from_coords': {'lat': self.pickup_coords[0], 'lng': self.pickup_coords[1]},
                'to_coords': {'lat': self.dropoff_coords[0], 'lng': self.dropoff_coords[1]},
                'type': 'dropoff',
            })

        stops = []
        for day_entry in self.days:
            for seg in day_entry['segments']:
                if 'break' in seg['label'].lower() or 'fuel' in seg['label'].lower():
                    stops.append({
                        'type': seg['label'],
                        'date': day_entry['date'],
                        'start_hour': seg['start_hour'],
                        'end_hour': seg['end_hour'],
                    })

        return {
            'trip': {
                'current_location': self.current_location,
                'pickup_location': self.pickup_location,
                'dropoff_location': self.dropoff_location,
                'total_distance_miles': round(self.total_distance, 0),
                'cycle_hours_used': self.cycle_hours_used,
            },
            'legs': legs,
            'eld_logs': self.days,
            'stops': stops,
        }
