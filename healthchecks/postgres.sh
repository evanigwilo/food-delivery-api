#!/bin/bash
set -eo pipefail

host="$(hostname -i || echo '127.0.0.1')"
user="${POSTGRES_USER:-$DATABASE_USER}"
db="${POSTGRES_DB:-$DATABASE_DB}"
export PGPASSWORD="${POSTGRES_PASSWORD:-$DATABASE_PASSWORD}"

args=(
	# force postgres to not use the local unix socket (test "external" network)
	--host "$host"
	--username "$user"
	--dbname "$db"
	--quiet --no-align --tuples-only
)

if select="$(echo 'SELECT 1' | psql "${args[@]}")" && [ "$select" = '1' ]; then
	exit 0
fi

exit 1
