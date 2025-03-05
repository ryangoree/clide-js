#!/bin/bash
set -e
cp README.md packages/clide-js/README.md
yarn build
changeset publish
