import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'backend'))

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eld_api.settings')

from django.core.asgi import get_asgi_application
app = get_asgi_application()
