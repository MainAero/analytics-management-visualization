#!/usr/bin/env bash
mongoimport --db tdsdb --collection user --drop --file /amazin/resources/users.json
mongoimport --db tdsdb --collection view --drop --file /amazin/resources/view.json
mongoimport --db tdsdb --collection viewVisits --drop --file /amazin/resources/viewVisits.json
mongoimport --db tdsdb --collection zone --drop --file /amazin/resources/zone.json
mongoimport --db tdsdb --collection venue --drop --file /amazin/resources/venue.json
mongoimport --db tdsdb --collection attribute --drop --file /amazin/resources/attribute.json
mongoimport --db tdsdb --collection aggregatedViewVisitData --drop --file /amazin/resources/aggregatedViewVisitData.json
