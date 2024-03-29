# Team10-api

```bash
# Create virtual environment
python ./scripts.py venv
# Or
python -m venv venv

# Activate virtual environment
source venv/bin/activate # linux bash
# Or
venv\Scripts\Activate.ps1 # windows pwsh

# Install dependencies
python ./scripts.py install
# Or
pip install -r requirements.txt

# Run development server
python ./scripts.py run --dev
# Or
uvicorn app.api:api --reload
# Or
python -m uvicorn app.api:api --reload

# Check types
python ./scripts.py check-types
# Or
mypy .

# Run tests and coverage
python ./scripts.py test --coverage
# Or
pytest -vv --cov api

# Format code
python ./scripts.py format
# OR
autopep8 --in-place --aggressive example.py
isort example.py

# Register admin user 
# OBS: This is a example. `seed-database` already add this user
python ./scripts.py register-admin --name "Admin" --email "admin@admin.com" --password "admin" --cellphone "987654321"

# Setup database indexes
python ./scripts.py setup-database-indexes

# Seed database
python ./scripts.py seed-database

# Drop database
python ./scripts.py drop-database

# Test
python ./scripts.py test

# Run mongo docker
docker run --detach --name mongo --publish 27017:27017 mongo
```

| Script Command | Manual Command | Description |
| --- | --- | --- |
| `python ./scripts.py venv` | `python -m venv venv` | Create virtual environment |
| - | `source venv/bin/activate` | Activate virtual environment (linux bash) |
| - | `venv\Scripts\Activate.ps1` | Activate virtual environment (windows pwsh) |
| `python ./scripts.py install` | `pip install -r requirements.txt` | Install dependencies |
| `python ./scripts.py run --dev` | `uvicorn api:app --reload` | Run development server |
| `python ./scripts.py check-types` | `mypy .` | Check types |
| `python ./scripts.py test --coverage` | `pytest -vv --cov server` | Run tests and coverage |
| `python ./scripts.py format` | `autopep8 --in-place --aggressive example.py`<br>`isort example.py` | Format code |
| `python ./scripts.py register-admin`<br>` --name "Admin" --email "admin@admin.com"`<br>` --password "admin" --cellphone "987654321"` | - | Register admin user |
| `python ./scripts.py setup-database-indexes` | - | Setup database indexes |
| `python ./scripts.py seed-database` | - | Seed database collections |
| `python ./scripts.py drop-database` | - | Drop database collections |
| `python ./scripts.py test` | `pytest -vv` | Run test |
| - | `docker run -d --name mongo -p 27017:27017 mongo` | Run mongo docker |
