#!/bin/sh
# Applies migrations/*.sql (in order) to the postgres service in
# docker-compose.yml. Run this once after first bringing the stack up, and
# again any time a new migrations/NNN_*.sql file is added.
set -eu

for f in migrations/*.sql; do
  echo "Applying $f..."
  docker compose exec -T postgres psql -U "${POSTGRES_USER:-lucent}" -d "${POSTGRES_DB:-lucent_commerce}" < "$f"
done
