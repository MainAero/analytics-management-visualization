#!/usr/bin/env bash
# @author MainAero
BASEDIR=$(dirname $0)
docker-compose -p ios -f ${BASEDIR}/docker-compose.production.yml kill
sleep 5
docker-compose -p ios -f ${BASEDIR}/docker-compose.production.yml up -d --force-recreate
sleep 5
docker exec mongo.db sh /amazin/resources/importDumps.sh
sleep 5
docker exec management.tool sh /amazin/management-tool/start.sh
echo "Restarted and rebuilt!"
exit 0