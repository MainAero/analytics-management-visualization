#!/usr/bin/env bash
# @author MainAero
BASEDIR=$(dirname $0)
docker-compose -p ios -f ${BASEDIR}/docker-compose.production.yml kill
sleep 5
docker-compose -p ios -f ${BASEDIR}/docker-compose.production.yml up -d --no-recreate
sleep 5
docker exec management.tool sh /amazin/management-tool/start.sh
echo "Restarted!"
exit 0