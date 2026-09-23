#!/bin/bash

target_db_path="/app/scripts/nginx-geoip-filtering/GeoLite2-Country.mmdb"

if [ -n "${MODSECURITY_GEOIP_DB_URL}" ]; then
  echo "Downloading GeoIP database"

  if ! curl -fLSs -o "${target_db_path}" "${MODSECURITY_GEOIP_DB_URL}"; then
    echo "Error: geoip download failed" >&2
    rm -f "${target_db_path}"
  fi
fi
