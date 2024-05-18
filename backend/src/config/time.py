import datetime
from enum import Enum


class TimeEnums(Enum):
    ONE_MINUTE_FROM_NOW = datetime.datetime.now() + datetime.timedelta(minutes=1)
    ONE_MONTH_FROM_NOW = datetime.datetime.now() + datetime.timedelta(days=30)
    ONE_WEEK_OF_SECONDS = 604800
    ONE_DAY_OF_SECONDS = 86400
    ONE_HOUR_OF_SECONDS = 3600
    FIFTEEN_MINUTES = 900