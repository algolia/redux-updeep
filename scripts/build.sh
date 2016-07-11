#!/usr/bin/env bash

set -e # exit when error, no verbose

printf "\nBuilding ${LIBRARY_NAME} library\n"

dist_dir="dist"

mkdir -p "${dist_dir}"
rm -rf "${dist_dir:?}"/*

BABEL_DISABLE_CACHE=1 BABEL_ENV=npm babel -q index.js -o "$dist_dir/index.js"
BABEL_DISABLE_CACHE=1 BABEL_ENV=npm babel -q src/ --out-dir "$dist_dir/src/" --ignore __tests__