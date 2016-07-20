#!/usr/bin/env bash
mongoimport --db tdsdb --collection user --drop --file ./users.json
mongoimport --db tdsdb --collection view --drop --file ./view.json
mongoimport --db tdsdb --collection viewVisits --drop --file ./viewVisits.json
mongoimport --db tdsdb --collection zone --drop --file ./zone.json
mongoimport --db tdsdb --collection venue --drop --file ./venue.json
mongoimport --db tdsdb --collection attribute --drop --file ./attribute.json
mongoimport --db tdsdb --collection aggregatedViewVisitData --drop --file ./aggregatedViewVisitData.json