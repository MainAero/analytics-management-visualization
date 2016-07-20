#!/usr/bin/env bash
cd /amazin/management-tool
npm install
npm install -g bower
npm install -g grunt-cli
bower install --allow-root --force
grunt build