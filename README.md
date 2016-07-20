# Indoor Location Analytics Framework

This was a [project](http://www.snet.tu-berlin.de/menue/teaching/winter_term_2015_2016/internet_of_services_lab_wt20152016/) I worked on (including me and two fellow students) during my studies at the Technical University of Berlin.
Mainly I have developed the backend part (node.js) and the vagrant and docker integration.

## About

The analytics framework is based on zones and views. 
Zones are geographic areas in which targets are tracked, 
for example the meat section in a supermarket or a single radio cell when analyzing cell phone users. 
Views are sets of zones and can be thought of as areas of interest. 
For example, one might be interested in the number of customers in the whole supermarket and so one might 
define a view which consists of all zones in the supermarket. 
As a mobile service provider, one might have a view Kreuzberg consisting of all zones in the district Kreuzberg in 
Berlin to analyze all users in that area. To simplify the creation of views, 
they can be organized in a hierarchy. For example, one might need a view of all zones in Berlin. 
Instead of putting all zones in that view directly, one might add the views of all districts. 
Using views hierarchically makes it much easier to see what a view contains. 
Additionally one might change a single view and all parent views are automatically updated.

After defining a view, data for that view is accumulated and one can start requesting data of that view. 
For example, one can request the number of visitors per hour in a view from 8am to 5pm, 
or you request the number of long visits per month in a view from January 2015 to January 2016.

## System architecture

The framework is splitted into two parts. A REST-API running as `node-js` application and a frontend application
running as HTML5 wep app. You can run the applications as a distributed system on separately machines.

For the REST-API you need to install `node-js`.
The frontend application needs to serve by a webserver like `nginx` or `apache`.
Furthermore it needs `npm`, `bower` and `grunt-cli` to solve its dependencies to third party libraries.

# How to use

We provide you a one click setup for your production environment based on `docker` and `docker-compose`.
For development purpose we provide you a full development environment based on `vagrant`.

## Docker

Please install the latest `docker` version on your machine(s). Please make sure that the command `docker-compose` is callable.
Setup is tested on versions:
* `$ docker --version Docker version 1.9.1, build a34a1d5`
* `$ docker-compose --version docker-compose version 1.5.2, build 7240ff3`

There are two configuration files available to setup the environment.
One is called `docker-compose.production.yml` and should be used only on linux-based systems.
This configuration will share/sync the project files into the docker containers.
As synchronizing files can lead to problems on windows and sometimes even on mac os,
we provide a second configuration file `docker-compose.yml` which will copy the project files into the docker containers.
The downside of the second configuration is that you have to rebuild the whole 
docker containers (including underlying images) when the files of the project will change. We suggest to always prefer 
the first configuration file if possible.

### Setup Linux

If you choose the first configuration file `docker-compose.production.yml` there are shell scripts available
which combine all command to execute. Make sure that your operation system is fully supported by docker 
(windows and mac os are not supported fully).

To build the environment the first time simply run in project root: `sh rebuild.sh`
This will (re)build all containers and will import our data-fixtures to the mongodb container (NOTICE: ALL DATA IN MONGODB GETS LOST)

If you want only to restart the containers type: `sh restart.sh`. This will kill all running containers, restart the containers
and will run `npm install && bower install && grunt build` on the frontend application container. 

These two shell scripts are intended to used with a CI-Server. E.g. sync the new files to your productive machines and run `sh restart.sh`.

### Manually setup (all os)

1. Change directory to the project root.
2. Run `docker-compose -p ios -f ./docker-compose.yml kill` to make sure every old containers are stopped.
3. Build containers by running `docker-compose -p ios -f ./docker-compose.yml up -d --force-recreate` (can take a while)

	3.1. If you will get some errors, delete every related docker (and docker-compose) image:
    * To see all docker-compose containers: `docker-compose -p ios ps`
    * Delete containers related to this project `docker-compose -p ios rm <image>`:
	    * `docker-compose -p ios rm mongo.db && docker-compose -p ios rm amazin.api && docker-compose -p ios rm management.tool`
   
    If you have still trouble, delete the underlying docker images: 
    * To see all docker images in general `docker images`
    * To force delete docker images `docker rmi -f <image>`
    Retry.
4. Import data fixtures to mongo.db container: `sh import-data-docker-mongo.sh`
5. The docker containers should now be accessible via ip of docker.

## Vagrant

For your daily development work you can use one vagrant machine.
The complete application (including REST-API, frontend application and mongodb) will run on one virtual machine on your localhost.

Setup is tested on versions:
* `$ vagrant --version Vagrant 1.7.4`
* `$ VBoxManage --version 5.0.14r105127`

1. Install `vagrant` and `virtualbox`
2. Change directory to project root
3. Move `Vagrantfile.dist` to `Vagrantfile`
4. Run `vagrant up`

May you have to start the REST-API manually:
* `vagrant ssh` to get bash access
* `cd api && node app.js` will start the REST-API

To update the frontend:
* Get bash of vagrant (`vagrant ssh`)
* Change to management-tool directory (`cd management-tool`)
* Run `npm install && bower install && grunt build`

