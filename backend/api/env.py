from pydantic import BaseSettings

# https://pydantic-docs.helpmanual.io/usage/settings/

HOUR = 1000 * 60 * 60
DAY = 24 * HOUR


class Settings(BaseSettings):
    mongo_uri = "mongodb://localhost:27017"
    jwt_secret = "secret"
    jwt_expires_in = 2 * HOUR
    jwt_refresh_expires_in = 2 * DAY
    production = False


settings = Settings(_env_file=".env", _env_file_encoding="utf-8")
settings.production = "localhost" not in settings.mongo_uri
