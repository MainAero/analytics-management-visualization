# amazIN/Indoor Analytics API
This project provides a visual and interactive access to the amazIN API. It is based on swagger-node-express and swagger-ui. In addition it contains an express-based REST API. The core functionality of the REST API is to provide an endpoint for querying various metrics and data dimensions related to the visitors and visitors occurring at a defined location. Besides this, it also provides a way to perform CRUD operations in some endpoints, such as *Venues*, *Zones* and *Views*. The first step when creating the endpoints is to create a Venue. This Venues will serve as a base to created Zones. After it is possible to create tallyNodes which will be associated to Zones. The last element are Views which can contain several Zones. Views are the core for the aggregation process as the dimensions and metrics will be based on each of them. There is also the possibility of using attributes to describe Views, e.g. city, country.  

## How to add components to the API

### How to add a new endpoint

To add a new endpoint the following steps are required:

    1. Create a new file under controllers/ with the endpoint name. Here you will define the functions to be used at this endpoint
   
    2. Create a new file under routes/ with the endpoint name. It will look something like

               var CONTROLLER_NAME = require('../controllers/ENDPOINT_NAME');

               module.exports = function (app, nconf) {
                  app.get(nconf.get("rest:api_url_prefix") + '/ENDPOINT_NAME', CONTROLLER_NAME.FUNCTION_NAME);
               }

    3. Add to the file routes/routes.js the following line:

               require('./ENDPOINT_NAME')(app, nconf);
     

### How to add a new dimension

Dimensions are connected to metrics, so in order to create a new dimension you need to know for which metric it will work. E.g. for a new dimension called "starting visits" you need to know for which metric you want to create (count, averageDwellTime, frequency).

To add a new dimension the following steps are required:

    1. Go to controllers/data/constants.js and add your new dimension like this:
    
                exports.YOUR_NEW_DIMENSION_NAME = "yourDimensionName";
                
    2. Create a new file under controllers/data/dimensions and follow the rules described in controllers/data/dimensions/readMe.txt. This file will start with the metric name and after the dimension. E.g. countOfStartingVisitsDim.js will be for the metric "count" and dimension "startingVisits".

    3. Add to the beggining of the file controllers/data.js the file you created:

                var YOUR_METRIC_DIMENSION_NAME = require('./data/dimensions/"yourFileName.js');

    4. After, you need to add to the following method your new dimension, according to the metric it is implenting (this case would be metric count): 

                //This method is responsible to return the relevant grouping task based on the dimension/metric
                exports.getRelevantTask = function (dim, metric) {
                  if (metric == constants.COUNT_MET) {
                    if (dim == constants.YOUR_NEW_DIMENSION_NAME) //new created dimension
                      return YOUR_METRIC_DIMENSION_NAME;
                  }
                }
                
---
If you want to add a new metric follow these steps:

### How to add a new metric

To add a new metric the following steps are required:

    1. Go to controllers/data/constants.js and add your new metric like this:
        
            exports.YOUR_NEW_METRIC_MET = "yournewmetricname";
    
    2. To create a new metric calculation, which will be associated to a dimension just follow the procedures 2. to 3. on how to add a new dimension.
    
    3.  After, you need to add to the following method your new metric, according to the dimension it is implenting (this case would be dimension startingVisits): 

            //This method is responsible to return the relevant grouping task based on the dimension/metric
            exports.getRelevantTask = function (dim, metric) {
              if (metric == constants.YOUR_NEW_METRIC_MET) { //new created metric
                if (dim == constants.STARTING_VISITS) //dimension
                  return YOUR_METRIC_DIMENSION_NAME; 
              }
            }
---      


## Code structure


*models/* : Contains the models of the application as mongoose schemes

*tests/* : Contains test files and scripts required for aggregations tests

*routes/* : Contains the routes of the application to the different endpoints

*controllers/* : Contains the controllers of the application to the different endpoints

*custom-modules/* : Contains the modules needed to run swagger

*doc/* : Contains further documentation files

## Models

*attribute* : A pair name-value used to describe a view. Can be for example City-Berlin or Country-Germany. Stored in the database in collection *'attribute'* 

        {
          name: String,
          value: String
        }

*tallyNode* : Represents the physical properties of a tally Node and is associated with a zone. Stored in the database in collection *'tallyNode'*

        {
          name: String,
          description: String,
          tallyNodeId: String,
          sdCardNumber: Number,
          portNumber:String,
          macAddress_eth: String,
          macAddress_wlan: String,
          ip: String,
          zone: {type: Schema.ObjectId, ref: "Zone"}
        }

*venue* : A larger geographical area such as a shopping center, an airport or a campus. Described by its postal address, a geometric polygon, number of floors. Stored in the database in collection *'venue'*
    
        {
          name: String,
          description: String,
          address: {
            street: String,
            zip: Number,
            city: String,
            country: String
          },
          location: {
            latitude: Number,
            longitude: Number
          },
          icon_URL: String
        }

*view* : A set of zones. A view is the basic entity for any analytics query. Stored in the database in collection *'view'*
    
        {
          name: String,
          description: String,
          icon_URL: String,
          zone_arr: [
            {type: Schema.ObjectId, ref: "Zone"}
          ],
          parents_arr: [
            {type: Schema.ObjectId, ref: "View"}
          ],
          children_arr: [
            {type: Schema.ObjectId, ref: "View"}
          ],
          attributes_arr: [
            {type: Schema.ObjectId, ref: "Attribute"}
          ],
          aggregate: Boolean
        }

*viewvisit* : First aggregation of the raw measurements data to group by views and target ids. Stored in the database in collection *'viewVisits'*

        {
          _id: {
            view_id: {type: Schema.Types.ObjectId},
            target_id:{type:String}
          },
          value:{
            "visitIntervals":[
              {
                  date_entered: {type: Date},
                  date_lastseen: {type: Date}
              }
            ]
          }
        }

*viewvisitmerged* : Aggregation of data grouped by view, dimensions, date dimensions and metrics. Stored in the database in collection *'aggregatedViewVisitData'*

        {
          _id: Schema.Types.ObjectId,
          view_id: {type: Schema.Types.ObjectId},
          dimension : {type: String},
          dateDimension: {type: String},
          date : {type: Date},
          metric: {type: String},
          value: {type: Schema.Types.Mixed}
        }
    
*wifireport*: Raw measurements data coming from the tally master and saved in the tally datastore. Stored in the database in collection *'wifireport'*

        {
          _id: {type: Schema.ObjectId},
          venue: {type: Schema.ObjectId, ref: "Venue"},
          zone_arr: [
            {type: Schema.ObjectId, ref: "Zone"}
          ],
          master_id: {type: String},
          target_id: {type: String},
          timestamp_start: {type: Number, index:true},
          timestamp_end: {type: Number},
          time_start: {type: Date},
          time_end: {type: Date},
          wlan_seq: {type: Number},
          measurements: [
            {
                node_id: {type: String},
                zone: {type: Schema.ObjectId, ref: "Zone"},
                rssi: {type: Number},
                noise: {type: Number},
                ch_type: {type: String},
                ch_freq: {type: String},
                timestamp: {type: Number},
                time: {type: Date},
                wlan_seq: {type: Number}
            }
          ]
        }

*zone* : A small geographical area (e.g. a single room or a floor). Described either by symbolic coordinates such as "Room A115" or by geometric coordinates. Stored in the database in collection *'zone'*

        {
          name: String,
          description: String,
          location: {
            latitude: Number,
            longitude: Number,
            floorNumber: String
          },
          location_description: String,
          icon_URL: String,
          area:Number,
          venue: {type: Schema.ObjectId, ref: "Venue"}
        }

## Tests

The tests were implemented using Grunt, Mocha and a Vagrant machine.
In the *Gruntfile.js* are defined the tasks that the tests should execute. For example:

        grunt.registerTask('integration', integrationDescription, function () {
          var tasks = ['clone-tally-datastore','vagrant-up:integration','vagrant-test-datastore','vagrant-test','vagrant-destroy', 'clean-datastore'];

          // force to execute all the tasks
          grunt.option('force', true);
          grunt.task.run(tasks);
        });

is a task responsible for implementing each of the single tasks defined in the tasks array. Using the command *grunt integration*  would run this task.

In the file *package.json* it is defined another way to run the tests by using:

        "scripts": {
          "test": "./node_modules/grunt-cli/./bin/grunt integration "
        },

we can run the command *npm test* and it will be executed *grunt integration*.
We can define the location of the scripts to be executed by the tests as well as changing the format in which the results will be presented. For that we just need to change the following lines:

        mochaTest: {
            test: {
                options: {
                    reporter: 'xunit', //test results format
                    captureFile: './tests/test-result.xml' //where the results will be saved
                },
                src: ['tests/tester.js'] //scripts that should be run by the test
            }
        }

In the folder *tests/* you can find the main script *tester.js* and more detailed information in the *readme.md* on how to implement and extend the test cases.


## Routes

*data* : Contains the routes (url endpoints) for the data 

*routes* : Contains the initialization of all the other routes

*venues* : Contains the routes (url endpoints) for the venues

*views* : Contains the routes (url endpoints) for the views

*zones* : Contains the routes (url endpoints) for the zones

## Controllers

*data* : Contains the functions responsible for handling with the data endpoint

*venue* : Contains the functions responsible for handling with the venues endpoint

*view* : Contains the functions responsible for handling with the views endpoint

*zone* : Contains the functions responsible for handling with the zones endpoint


## Custom-modules

We use these modules so that we are able to change swagger has we wanted and not to have the problem of everytime a swagger version is updated we loose our configurations. Some adaptations were done in the files *swagger_ui/dist/index.html* and *swagger-node-express/Common/node/swagger.js* 

---

## API URL endpoints

For detailed information about the API endpoints please see [doc/APIendpoints-README.md](https://git.snet.tu-berlin.de/amazin/api/blob/develop/doc/APIendpoints-README.md)

---

## Configuration

In the file config.json we can set the access to the database, the api settings and the swagger settings

    mongodb

        dbname: "tdsdb" //Name of database used in mongodb
        host: "localhost" //Name of host used for mongodb
        user: "tds_user" //username which has read and write access to the database
        password: "somepassword" //password fitting to the provided username
        reconnectTime: 10000 //parameter to use in the database options to set the reconnect time in case the connection to the database fails (in ms)

    rest

        api_port: 3000 //port number where the api will be listening for requests
        api_url_prefix: "/api/v1" //common url prefix for all the endpoints
        api_host: "localhost" //Name of the host used for the api
        api_host_test:"127.0.0.1" //to set up the localhost in the vagrant machine for testing purposes needed to be in this form
        api_version: "0.2" //api version number

    swagger-ui

        swagger_host:"https://amazin-dev-1.snet.tu-berlin.de" //Name of the host (server mode) used for the swagger
        swagger_localhost:"http://localhost" //Name of the host (local machine mode) used for the swagger
        swagger_port:3000 //port number where the swagger-ui will be listening for requests

---

## Technical Requirements

The following describes the technical requirements for the Analytics REST API. It includes the 

### MongoDB

Install mongodb, e.g. 'sudo apt-get install mongodb' on ubuntu or get the most current version provided by 10gen (recommended)

        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
        echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
        sudo apt-get update
        sudo apt-get install mongodb-10gen


Check if your mongodb server is running well by starting a local mongo shell

        mongo

Should you receive the following Error:

        mongo.js:L112 Error: couldn't connect to server 127.0.0.1:27017 at src/mongo/shell/mongo.js:L112

You should check this easy solution provided at stackoverflow:

        http://stackoverflow.com/questions/16120397/mongo-jsl112-error-couldnt-connect-to-server-127-0-0-127017-at-src-mongo-she

### NodeJS

Install the most current maintained version of Nodejs on ubuntu:

        sudo apt-get update
        sudo apt-get install python-software-properties python g++ make
        sudo add-apt-repository ppa:chris-lea/node.js
        sudo apt-get update
        sudo apt-get install nodejs

Run

    	npm update
    	npm install

after cloning the repository

### Run the Server and scripts

Run

        node app.js

for running the server application
-> The REST API webserver will be started and ready for queries.

### Run swagger-ui

To run the swagger-ui in localhost you will have to uncomment the following line in the swaggerapi.js:

        /**
        * Configuration for LOCALHOST
        */
        //swagger.configure(nconf.get("swagger-ui:swagger_localhost")+":"+nconf.get("swagger-ui:swagger_port")+nconf.get("rest:api_url_prefix"),nconf.get("rest:api_version"));

and comment the following:


        /**
        * Configuration for amazin-dev-1
        */
        swagger.configure(nconf.get("swagger-ui:swagger_host") + nconf.get("rest:api_url_prefix"), nconf.get("rest:api_version"));

Start the API with:

    	node app.js

Open the following URL in your browser:

    	http://localhost:3000/api/v1/docs/

Then change the URL on the right side of the amaZin logo from:

    	https://amazin-dev-1.snet.tu-berlin.de/api/v1/api-docs

to:

    	http://localhost:3000/api/v1/api-docs

If everything works, you should see a list of four URL endpoints on the left (venues, zones, views, data).

Start to explore the API by clicking on the endpoints and subsequently expanding all operations.

### Run the API process as a Linux Service

Copy the 

        amazin-api
        
init.d script, which is included in the repository  to /etc/init.d/ . After you have copied this script to the destination you are able to run 
        
        sudo service amazin-api start/stop/restart

In order to rerun the service on boot make sure you run 

        sudo update-rc.d amazin-api defaults


