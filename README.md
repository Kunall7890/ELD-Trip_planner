# ELD Trip Planner

**FMCSA Hours-of-Service (HOS) compliant trip planning for commercial truck drivers.**

A full-stack application that automatically generates legally compliant daily driving schedules, enforces mandatory rest breaks, tracks the 70-hour / 8-day rolling cycle, and produces inspection-ready FMCSA Form 395 log sheets.

![ELD Trip Planner](./frontend/public/eld-demo.gif)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [HOS Compliance Rules](#hos-compliance-rules)
- [Deployment](#deployment)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **HOS-Compliant Trip Planning** — Automatically schedules driving, on-duty, and sleeper-berth segments in full compliance with FMCSA regulations.
- **FMCSA Form 395 Log Sheets** — Renders downloadable, printable daily ELD log sheets to a high-DPI canvas.
- **Interactive Route Map** — Visualizes pickup and drop-off legs on a Leaflet map with auto-zoom and popup markers.
- **3D Truck Visualization** — Interactive Three.js model of a semi-truck with cab, trailer, and cargo.
- **Geocoding** — Automatically resolves city/state inputs to latitude/longitude coordinates via Nominatim (OpenStreetMap).
- **Day-by-Day Itinerary** — Breaks down each day into labelled segments with start/end times, status badges, and cycle-hour tracking.
- **Fuel Stop Optimization** — Automatically inserts fuel stops every 1,000 miles.
- **Responsive Design** — Works on desktop, tablet, and mobile viewports.
- **GSAP Animations** — Smooth entrance animations, scroll-triggered reveals, and interactive UI feedback.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router 7, Vite 5 |
| **Backend** | Django 4.2, Django REST Framework |
| **Maps** | Leaflet via react-leaflet |
| **Animations** | GSAP 3, Three.js |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **Static Files** | WhiteNoise |
| **Geocoding** | Nominatim (OpenStreetMap) |
| **Deployment** | Vercel (Python serverless + static build) |

### Frontend Dependencies

| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `react-leaflet` / `leaflet` | Interactive maps |
| `gsap` / `@gsap/react` | Animations |
| `three` | 3D rendering |

### Backend Dependencies

| Package | Purpose |
|---|---|
| `django` | Web framework |
| `djangorestframework` | REST API toolkit |
| `django-cors-headers` | Cross-origin resource sharing |
| `whitenoise` | Production static file serving |
| `psycopg2-binary` | PostgreSQL adapter |

---

## Architecture

```
┌─────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│   Browser   │────▶│  React + Vite SPA   │────▶│  Nominatim API   │
│  (User)     │     │   (Vercel Static)   │     │  (Geocoding)     │
└─────────────┘     └──────────┬──────────┘     └──────────────────┘
                               │
                        POST /api/plan-trip/
                               │
                        ┌──────▼──────┐
                        │   Vercel    │
                        │  Python ASGI│
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │   Django    │
                        │  REST API   │
                        │             │
                        │  TripEngine │
                        │  (HOS Logic)│
                        └─────────────┘
```

The frontend is a single-page application (SPA) built with React and Vite. It communicates with the Django backend exclusively through the REST API endpoint at `/api/plan-trip/`. The backend implements the full FMCSA HOS compliance engine and returns daily schedules, segment logs, and trip metadata.

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

### Backend Setup

```bash
# Navigate to the project root
cd eld-trip-planner

# Create and activate a virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Run database migrations
python backend/manage.py migrate

# Start the Django development server
python backend/manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/plan-trip/`.

### Frontend Setup

Open a second terminal:

```bash
# Navigate to the frontend directory
cd eld-trip-planner/frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will be available at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the Django backend automatically.

---

## API Reference

### `POST /api/plan-trip/`

Plans a complete HOS-compliant trip between three locations.

#### Request Body

```json
{
  "current_location": "New York, NY",
  "pickup_location": "Philadelphia, PA",
  "dropoff_location": "Washington, DC",
  "current_lat": 40.7128,
  "current_lng": -74.006,
  "pickup_lat": 39.9526,
  "pickup_lng": -75.1652,
  "dropoff_lat": 38.9072,
  "dropoff_lng": -77.0369,
  "cycle_hours_used": 10.0
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `current_location` | string | yes | Starting location name |
| `pickup_location` | string | yes | Pickup location name |
| `dropoff_location` | string | yes | Drop-off location name |
| `current_lat` | float | no | Starting latitude (-90 to 90) |
| `current_lng` | float | no | Starting longitude (-180 to 180) |
| `pickup_lat` | float | no | Pickup latitude |
| `pickup_lng` | float | no | Pickup longitude |
| `dropoff_lat` | float | no | Drop-off latitude |
| `dropoff_lng` | float | no | Drop-off longitude |
| `cycle_hours_used` | float | yes | Hours used in current 70-hour cycle (0–70) |

Coordinates enable map rendering on the frontend; if omitted, the map will still display route text instructions.

#### Response `200 OK`

```json
{
  "trip": {
    "current_location": "New York, NY",
    "pickup_location": "Philadelphia, PA",
    "dropoff_location": "Washington, DC",
    "total_distance_miles": 240,
    "cycle_hours_used": 10.0
  },
  "legs": [
    {
      "from": "New York, NY",
      "to": "Philadelphia, PA",
      "from_coords": { "lat": 40.7128, "lng": -74.006 },
      "to_coords": { "lat": 39.9526, "lng": -75.1652 },
      "type": "pickup"
    },
    {
      "from": "Philadelphia, PA",
      "to": "Washington, DC",
      "from_coords": { "lat": 39.9526, "lng": -75.1652 },
      "to_coords": { "lat": 38.9072, "lng": -77.0369 },
      "type": "dropoff"
    }
  ],
  "eld_logs": [
    {
      "date": "2026-06-17",
      "segments": [
        { "start_hour": 6.0, "end_hour": 6.25, "status": "on_duty", "label": "Pre-trip inspection" },
        { "start_hour": 6.25, "end_hour": 10.0, "status": "driving", "label": "Driving to pickup" },
        { "start_hour": 10.0, "end_hour": 11.0, "status": "on_duty", "label": "Pickup" },
        { "start_hour": 11.0, "end_hour": 14.5, "status": "driving", "label": "Driving to dropoff" },
        { "start_hour": 14.5, "end_hour": 15.5, "status": "on_duty", "label": "Drop-off" },
        { "start_hour": 15.5, "end_hour": 24.0, "status": "sleeper", "label": "Sleeper berth" }
      ],
      "total_driving_hours": 7.5,
      "total_on_duty_hours": 9.5,
      "remaining_cycle_hours": 50.5
    }
  ],
  "stops": [
    { "type": "Fuel stop", "date": "2026-06-17", "start_hour": 12.0, "end_hour": 12.5 }
  ]
}
```

#### Response Fields

| Field | Type | Description |
|---|---|---|
| `trip` | object | Trip summary with locations and totals |
| `legs` | array | Route legs (current → pickup → dropoff) |
| `eld_logs` | array | Daily logs with time segments |
| `eld_logs[].segments[].status` | string | One of: `driving`, `on_duty`, `off_duty`, `sleeper` |
| `eld_logs[].total_driving_hours` | float | Total driving time that day |
| `eld_logs[].total_on_duty_hours` | float | Total on-duty time (driving + non-driving) |
| `eld_logs[].remaining_cycle_hours` | float | Remaining hours in the 70-hour cycle |
| `stops` | array | Automatically inserted stops (fuel, etc.) |

#### Error Responses

| Status | Body | Description |
|---|---|---|
| `400` | `{ "field_name": ["Error message"] }` | Request validation failure |
| `500` | `{ "error": "...", "detail": "Trip planning failed..." }` | Internal engine error |

---

## HOS Compliance Rules

The trip engine enforces the following FMCSA Hours-of-Service regulations at 49 CFR Part 395:

| Rule | Limit | Enforcement |
|---|---|---|
| **11-Hour Driving Limit** | Max 11 hours driving per day | Driving segments automatically stop at 11 hours |
| **14-Hour On-Duty Window** | Max 14 hours on-duty per day | After 14 hours on-duty, driver must go off-duty |
| **30-Minute Break** | Required after 8 consecutive hours of driving | 30-minute off-duty break auto-inserted |
| **10-Hour Off-Duty** | Minimum 10 consecutive hours off-duty per day | Remaining hours marked as sleeper berth |
| **70-Hour / 8-Day Cycle** | Max 70 hours on-duty in any rolling 8-day period | Accumulated hours tracked; days outside window dropped |
| **60-Hour / 7-Day Cycle** | Alternative cycle for carriers without daily operations | Not implemented (submit a PR) |

### Engine Constants

| Constant | Value | Description |
|---|---|---|
| `MAX_DRIVING_HOURS_PER_DAY` | 11 | Maximum daily driving time |
| `MAX_ON_DUTY_HOURS_PER_DAY` | 14 | Maximum daily on-duty window |
| `BREAK_AFTER_DRIVING_HOURS` | 8 | Mandatory break trigger threshold |
| `BREAK_DURATION_HOURS` | 0.5 | Break length (30 minutes) |
| `OFF_DUTY_HOURS_REQUIRED` | 10 | Minimum off-duty rest |
| `MAX_CYCLE_HOURS` | 70 | Rolling 8-day cycle limit |
| `AVERAGE_SPEED_MPH` | 65 | Speed assumed for distance-to-time conversion |
| `PICKUP_DROP_HOURS` | 1 | Time allocated per pickup/drop-off event |
| `FUEL_INTERVAL_MILES` | 1000 | Fuel stop frequency |
| `FUEL_STOP_DURATION_HOURS` | 0.5 | Fuel stop duration |

---

## Deployment

### Vercel (Recommended)

The project is pre-configured for Vercel deployment with a `vercel.json` that handles both the Python backend and the React frontend.

#### Steps

1. Push the repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com/import).
3. Set the **Root Directory** to `.` (repo root).
4. Vercel automatically detects the build configuration from `vercel.json`.
5. Add the environment variables listed below.
6. Click **Deploy**.

#### Build Configuration (`vercel.json`)

```json
{
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "api/index.py" },
    { "src": "/assets/(.*)", "dest": "/frontend/assets/$1" },
    { "src": "/(.*\\.(js|css|gif|mp4|svg|ico|png|json|txt|woff|woff2))", "dest": "/frontend/$1" },
    { "src": "/(.*)", "dest": "/frontend/index.html" }
  ]
}
```

### Environment Variables

Set these in your Vercel project dashboard under **Settings → Environment Variables**:

| Variable | Required | Default | Description |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | **Yes** | — | Django secret key (generate via `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`) |
| `DJANGO_DEBUG` | No | `True` | Set to `False` in production |
| `DJANGO_ALLOWED_HOSTS` | No | `localhost,127.0.0.1,.vercel.app,.now.sh` | Comma-separated list of allowed host/domain names |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173,http://localhost:3000,https://eld-trip-planner-xi.vercel.app` | Comma-separated list of allowed CORS origins |
| `CORS_ALLOW_ALL_ORIGINS` | No | `false` | Set to `true` to allow all origins (not recommended for production) |
| `DATABASE_URL` | No | — | PostgreSQL connection string (e.g., `postgres://user:pass@host:5432/db`). Falls back to SQLite if not set |

> **Note:** Vercel's serverless environment has an ephemeral filesystem. If `DATABASE_URL` is not set, the app uses SQLite, which will **not persist data** between deployments. Use a managed PostgreSQL service (Vercel Postgres, Neon, Supabase, etc.) for production.

#### Production Checklist

- [ ] Generate and set a strong `DJANGO_SECRET_KEY`
- [ ] Set `DJANGO_DEBUG` to `False`
- [ ] Provision a PostgreSQL database and set `DATABASE_URL`
- [ ] Add your production domain to `DJANGO_ALLOWED_HOSTS`
- [ ] Add your production domain to `CORS_ALLOWED_ORIGINS`
- [ ] Run `python manage.py migrate` (via a one-off Vercel CLI command or during build)

---

## Project Structure

```
eld-trip-planner/
├── api/
│   └── index.py                   # Vercel Python serverless entry point
├── backend/
│   ├── eld_api/                   # Django project package
│   │   ├── settings.py            # Configuration (DB, CORS, allowed hosts)
│   │   ├── urls.py                # Root URL routing
│   │   ├── wsgi.py                # WSGI application
│   │   └── asgi.py                # ASGI application (used by Vercel)
│   ├── trip/                      # Trip planning Django app
│   │   ├── admin.py               # Admin interface registration
│   │   ├── eld_engine.py          # HOS compliance engine (core logic)
│   │   ├── models.py              # Trip database model
│   │   ├── serializers.py         # Request validation
│   │   ├── urls.py                # API endpoint routing
│   │   └── views.py               # API view (PlanTripView)
│   ├── manage.py                  # Django management script
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── public/
│   │   ├── bg-video.mp4           # Hero section background video
│   │   └── eld-demo.gif           # Demo animation
│   ├── src/
│   │   ├── api.js                 # API client (geocoding, planTrip)
│   │   ├── App.jsx                # Route definitions
│   │   ├── main.jsx               # Application entry point
│   │   ├── index.css              # Global styles and design tokens
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   └── PlanTrip.jsx       # Trip planning page
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── HeroSection.jsx    # Hero with video background
│   │   │   ├── StorySection.jsx   # 3D truck + timeline story
│   │   │   ├── FeatureSection.jsx # Feature cards
│   │   │   ├── HowItWorks.jsx     # Step-by-step guide
│   │   │   ├── TripPlanner.jsx    # Trip planning form
│   │   │   ├── TripForm.jsx       # Alternate form component
│   │   │   ├── TripResults.jsx    # Results dashboard
│   │   │   ├── RouteInstructions.jsx  # Day-by-day itinerary
│   │   │   ├── MapView.jsx        # Leaflet interactive map
│   │   │   ├── EldLogsView.jsx    # Daily log selector
│   │   │   ├── EldLogSheet.jsx    # Canvas log sheet renderer
│   │   │   ├── Truck3D.jsx        # Three.js 3D truck model
│   │   │   ├── TruckLoading.jsx   # Animated loading screen
│   │   │   └── Footer.jsx         # Site footer
│   │   └── utils/
│   │       └── eldLogRenderer.js  # Canvas rendering engine for Form 395
│   ├── index.html                 # HTML template
│   ├── package.json               # npm dependencies
│   └── vite.config.js             # Vite configuration + API proxy
├── vercel.json                    # Vercel deployment configuration
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-feature`).
3. Make your changes.
4. Run the backend tests if applicable (`python backend/manage.py test`).
5. Commit your changes (`git commit -m 'Add my feature'`).
6. Push to the branch (`git push origin feature/my-feature`).
7. Open a Pull Request.

---

## License

This project is for assessment and educational purposes.

---

## Acknowledgements

- **FMCSA** — Federal Motor Carrier Safety Administration for the HOS regulations framework.
- **OpenStreetMap / Nominatim** — Free geocoding service.
- **Leaflet** — Open-source mapping library.
- **Three.js** — 3D rendering library.
- **GSAP** — GreenSock Animation Platform.
