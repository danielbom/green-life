import os
import sys

from fastapi.testclient import TestClient

# fmt: off
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.app import app

# fmt: on

client = TestClient(app)

__all__ = ['client']
