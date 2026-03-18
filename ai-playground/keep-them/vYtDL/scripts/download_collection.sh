#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: $0 <collection_url> <output_dir> [quality]" >&2
  exit 1
fi

COLLECTION_URL="$1"
OUTPUT_DIR="$2"
QUALITY="${3:-1080}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

mkdir -p "${OUTPUT_DIR}"

cd "${PROJECT_DIR}"
go run . download \
  --no-tui \
  --playlist \
  --quality "${QUALITY}" \
  --output "${OUTPUT_DIR}" \
  "${COLLECTION_URL}"
