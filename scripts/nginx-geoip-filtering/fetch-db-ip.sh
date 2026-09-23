#!/bin/bash
#
# Downloads the GeoIP database used by the ModSecurity geo filter.
# Runs during the Scalingo build (scalingo-prebuild in package.json).

set -uo pipefail

target_dir="/app/scripts/nginx-geoip-filtering"
target_db_path="${target_dir}/GeoLite2-Country.mmdb"

if [ -z "${MODSECURITY_GEOIP_DB_URL:-}" ]; then
  echo "MODSECURITY_GEOIP_DB_URL is not set, skipping GeoIP database download."
  exit 0
fi

echo "Downloading GeoIP database into ${target_dir}"

# Download to a temp file on the SAME filesystem, then move it into place, so a
# failed/partial download never leaves a truncated .mmdb behind.
tmp_db_path="$(mktemp "${target_dir}/GeoLite2-Country.XXXXXX.mmdb.tmp")"

# Capture curl's stderr and exit code separately so we can report both.
curl_stderr="$(mktemp)"
http_code="$(curl -fL --show-error --silent \
  --write-out '%{http_code}' \
  -o "${tmp_db_path}" \
  "${MODSECURITY_GEOIP_DB_URL}" 2>"${curl_stderr}")"
curl_exit=$?

if [ "${curl_exit}" -ne 0 ]; then
  {
    echo "Error: GeoIP database download failed."
    echo "  curl exit code : ${curl_exit}"
    echo "  http status    : ${http_code:-<none>}"
    echo "  curl message   : $(cat "${curl_stderr}")"
    echo "  bytes written  : $(wc -c <"${tmp_db_path}" 2>/dev/null || echo 0)"
    # curl 23 (write error) and 63 usually mean the build filesystem is full.
    if [ "${curl_exit}" -eq 23 ]; then
      echo "  hint           : curl exit 23 = write error, most likely the build disk is full (ENOSPC)."
    fi
    echo "  disk usage for ${target_dir}:"
    df -h "${target_dir}" 2>&1 | sed 's/^/    /'
  } >&2
  rm -f "${tmp_db_path}" "${curl_stderr}"
  exit 1
fi

rm -f "${curl_stderr}"

# Guard against an empty/HTML body slipping through with a 2xx status.
if [ ! -s "${tmp_db_path}" ]; then
  echo "Error: downloaded GeoIP database is empty (http status ${http_code})." >&2
  rm -f "${tmp_db_path}"
  exit 1
fi

mv -f "${tmp_db_path}" "${target_db_path}"
echo "GeoIP database downloaded successfully ($(wc -c <"${target_db_path}") bytes, http status ${http_code})."
