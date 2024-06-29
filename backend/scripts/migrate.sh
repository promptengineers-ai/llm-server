### Set Environment Variables
set -a # automatically export all variables
source .env
set +a

alembic upgrade head
