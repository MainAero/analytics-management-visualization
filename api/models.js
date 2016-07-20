module.exports = {
    "Venue": {
        "id": "Venue",
        "properties": {
            /*"id": {
             "type": "long",
             "required": true
             },*/
            "name": {
                "type": "string",
                "required": true
            },
            "description": {
                "type": "string",
                "required": true
            },
            "address": {
                "type": "Address",
                "required": true
            },
            "location": {
                "type": "locationVenue",
                "required": true
            },
            "icon_URL": {
                "type": "string"
            }
        }
    },

    "Address": {
        "id": "Address",
        "properties": {
            "street": {
                "type": "string",
                "required": true

            },
            "zip": {
                "type": "long",
                "required": true

            },
            "city": {
                "type": "string",
                "required": true

            },
            "country": {
                "type": "string",
                "required": true
            }
        }
    },

    "locationVenue": {
        "id": "locationVenue",
        "properties": {
            "latitude": {
                "type": "long",
                "required": true
            },
            "longitude": {
                "type": "long",
                "required": true
            }
        }
    },

    "Venues": {
        "id": "Venues",
        "properties": {
            "venues": {
                "items": {
                    "$ref": "Venue"
                },
                "type": "Array"
            }
        }
    },

    "Zone": {
        "id": "Zone",
        "description": "A zone represents a small area of about 20x20m.",
        "properties": {
            /*"id": {
             "type": "long",
             "required": true
             },*/
            "name": {
                "type": "string",
                "required": true
            },
            "description": {
                "type": "string",
                "required": true
            },
            "location": {
                "type": "locationZone",
                "required": true
            },
            "location_description": {
                "type": "string",
                "required": true
            },
            "icon_URL": {
                "type": "string"
            },
            "area": {
                "type": "long",
                "required": true
            },
            "venue": {
                "type": "Venue id",
                "required": true
            }
        }
    },

    "locationZone": {
        "id": "locationZone",
        "properties": {
            "latitude": {
                "type": "long",
                "required": true
            },
            "longitude": {
                "type": "long",
                "required": true
            },
            "floorNumber": {
                "type": "string",
                "required": true
            }
        }
    },

    "Zones": {
        "id": "Zones",
        "properties": {
            "zones": {
                "items": {
                    "$ref": "Zone"
                },
                "type": "Array"
            }
        }
    },

    "Users": {
        "id": "Users",
        "properties": {
            "users": {
                "items": {
                    "$ref": "User"
                },
                "type": "Array"
            }
        }
    },

    "Row": {
        "id": "Row",
        "description": "A row represents the result for one data item in a query.",
        "properties": {
            "dimension": {
                "type": "string",
                "required": true
            },
            "data": {
                "type": "string[]",
                "required": true
            }
        }
    },

    "Rows": {
        "id": "Rows",
        "properties": {
            "rows": {
                "items": {
                    "$ref": "Row"
                },
                "type": "Array"
            }
        }
    },

    "View": {
        "id": "View",
        "description": "A view represents a collection of zones.",
        "properties": {
            "name": {
                "type": "String",
                "required": true
            },
            "description": {
                "type": "String",
                "required": true
            },
            "icon_URL": {
                "type": "string"
            },
            "zone_arr": {
                "items": {
                    "type": "Zone id"
                },
                "type": "Array",
                "required": true
            },
            "parents_arr": {
                "items": {
                    "type": "View id"
                },
                "type": "Array"
            },
            "children_arr": {
                "items": {
                    "type": "View id"
                },
                "type": "Array"
            },
            "attributes_arr": {
                "items": {
                    "type": "Attribute id"
                },
                "type": "Array"
            },
            "aggregate": {
                "type": "Boolean",
                "required": true
            },
            "status": {
                "type": "String"
            }
        }
    },

    "Views": {
        "id": "Views",
        "properties": {
            "views": {
                "items": {
                    "$ref": "View"
                },
                "type": "Array"
            }
        }
    },


    "Attribute": {
        "id": "Attribute",
        "description": "An Attribute represent pair of key-value to describe view attributes.",
        "properties": {
            "name": {
                "type": "String",
                "required": true
            },
            "value": {
                "type": "String",
                "required": true
            }
        }
    },

    "Attributes": {
        "id": "Attributes",
        "properties": {
            "attributes_arr": {
                "items": {
                    "$ref": "Attribute"
                },
                "type": "Array"
            }
        }
    },






    "VenueStats": {
        "id": "VenueStats",
        "properties": {
            "venue": {
                "type": "Venue"
            },
            "total_visitors": {
                "type": "long"
            },
            "new_visitors": {
                "type": "long"
            },
            "returning_visitors": {
                "type": "long"
            },
            "start-date": {
                "type": "ISODate"
            },
            "end-date": {
                "type": "ISODate"
            }
        }
    },

    "ZoneStats": {
        "id": "ZoneStats",
        "properties": {
            "zone": {
                "type": "Zone"
            },
            "total_visitors": {
                "type": "long"
            },
            "new_visitors": {
                "type": "long"
            },
            "returning_visitors": {
                "type": "long"
            },
            "start-date": {
                "type": "ISODate"
            },
            "end-date": {
                "type": "ISODate"
            }
        }
    },

    "User": {
        "id": "User",
        "description": "A regular user",
        "properties": {
            "id": {
                "type": "long",
                "required": true,
                "description": "The id of the user"
            },
            "username": {
                "type": "string",
                "description": "The username of the user"
            },
            "hash": {
                "type": "string",
                "description": "The password hash of the user"
            },
            "salt": {
                "type": "string",
                "description": "The password salt of the user"
            },
            "token": {
                "type": "string",
                "description": "The api token for that user (gets generated)"
            }
        }
    },

    "DataResponse": {
        "id": "DataResponse",
        "properties": {
            "query": {
                "type": "Query",
                "required": true,
                "description": "This object contains all the values passed as parameters to the query."
            },
            "rows": {
                "type": "Rows",
                "description": "The results for this query, one dimension per row."
            }

        }
    },

    "Query": {
        "id": "Query",
        "properties": {
            "viewId": {
                "type": "string",
                "required": true
            },
            "start-date": {
                "type": "ISODate",
                "required": true
            },
            "end-date": {
                "type": "ISODate",
                "required": true
            },
            "dimensions": {
                "description": "\nImplemented Dimensions: " +
                    "startingVisits, ongoingVisits, endingVisits, allVisitors, newVisitors, returningVisitors, passBy, longVisits, dateHour, " +
                    "dateDay, dateWeek, dateMonth, dateQuarter and dateYear.\n" +
                    "Not all dimensions combinations are allowed. Date dimensions (dateHour/dateDay...) can be combined with any non date dimension, " +
                    "or it can be omitted",

                "type": "string",
                "required": true
                /*"allowableValues": {
                    "valueType": "ARRAY",
                    "values": [
                        "allVisitors",
                        "newVisitors",
                        "passersbyVisitors",
                        "startingVisits",
                        "onGoingVisits",
                        "endingVisits",
                        "newVisits",
                        "passBy",
                        "longVisits",
                        "dateHour",
                        "dateDay",
                        "dateWeek",
                        "dateMonth",
                        "dateQuarter",
                        "dateYear"
                    ]
                }*/
            },
            "metrics": {
                "description": "Implemented metrics: count, averageDwellTime and frequency. The averageDwellTime metric returns time in seconds",
                "type": "string",
                "required": true
                /*"allowableValues": {
                    "valueType": "LIST",
                    "values": [
                        "count",
                        "averageDwellTime",
                        "frequency"
                    ]
                }*/
            }
        }
    }
};