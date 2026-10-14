import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Kaushal Setu"
    APP_TITLE: str = "Kaushal Setu (कौशल सेतु) - Labour Market Intelligence & Skill Demand-Supply Forecasting MVP"
    VERSION: str = "1.0.0-mvp"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "kaushal-setu-secure-demo-token-key-2026")
    DEFAULT_HORIZON_MONTHS: int = 6
    PILOT_STATES: list[str] = ["Maharashtra", "Uttar Pradesh", "Tamil Nadu"]
    DATA_ORIGIN: str = "synthetic-calibrated"

settings = Settings()
