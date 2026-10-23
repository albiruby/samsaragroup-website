#!/usr/bin/env bash
# Vercel ignoreCommand: exit 0 = skip build, exit 1 = build.
#
# Compare against the last successfully deployed commit when Vercel provides it,
# so a push with several commits cannot hide a code change behind a docs-only
# commit. If that SHA is gone (force push / shallow clone), build instead of
# failing the deployment.
set -euo pipefail

base="${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}"
if ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
  exit 1
fi

git diff --quiet "$base" HEAD -- \
  src public scripts package.json package-lock.json next.config.mjs \
  vercel.json postcss.config.mjs jsconfig.json tsconfig.json
