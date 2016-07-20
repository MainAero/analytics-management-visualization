#!/usr/bin/env bash
NODE_EXEC=/usr/bin/node
#NODE_ENV="production"
NODE_ENV=
NODE_APP='app.js'
APP_DIR='/amazin/api';
PID_FILE=$APP_DIR/pid/app.pid
LOG_FILE=/var/log/node/amazin-api.log
CONFIG_DIR=$APP_DIR/config

case "$1" in
    start)
        if [ -f $PID_FILE ]
        then
                echo "$PID_FILE exists, process is already running or crashed"
        else
                echo "Starting node app..."
		NODE_ENV=$NODE_ENV NODE_CONFIG_DIR=$CONFIG_DIR $NODE_EXEC $APP_DIR/$NODE_APP  1>$LOG_FILE 2>&1 &
		echo $! > $PID_FILE;
        fi
        ;;
    stop)
        if [ ! -f $PID_FILE ]
        then
                echo "$PID_FILE does not exist, process is not running"
        else
                echo "Stopping $APP_DIR/$NODE_APP ..."
		echo "Killing `cat $PID_FILE`"
		kill `cat $PID_FILE`;
		rm $PID_FILE;
                echo "Node stopped"
        fi
        ;;

	restart)
		if [ ! -f $PID_FILE ]
		then
			echo "$PID_FILE does not exist, process is not running"

		else
			echo "Restarting $APP_DIR/$NODE_APP ..."
			echo "Killing `cat $PID_FILE`"
			kill `cat $PID_FILE`;
			rm $PID_FILE;
			NODE_ENV=$NODE_ENV NODE_CONFIG_DIR=$CONFIG_DIR $NODE_EXEC $APP_DIR/$NODE_APP  1>$LOG_FILE 2>&1 &
			echo $! > $PID_FILE;
			echo "Node restarted"
		fi
		;;

	*)
		echo "Usage: /etc/init.d/amazin-api {start|stop|restart}"
	;;
esac
