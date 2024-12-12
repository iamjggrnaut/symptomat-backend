#!/bin/sh
TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
DOCKERRUN_FILE_NAME="Dockerrun.aws.json"
rm -f $DOCKERRUN_FILE_NAME
touch $DOCKERRUN_FILE_NAME
cp $1 $DOCKERRUN_FILE_NAME
