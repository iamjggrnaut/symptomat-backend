#!/bin/sh
TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
ENV_FILE=".env"
OLD_ENV_FILE_NAME="${ENV_FILE}.${TIMESTAMP}"
touch $OLD_ENV_FILE_NAME
mv $ENV_FILE $OLD_ENV_FILE_NAME
cp $1 $ENV_FILE
