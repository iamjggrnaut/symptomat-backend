#!/bin/sh
CONTAINER_NAME=
IMAGE_NAME=

yc compute instance update-container $CONTAINER_NAME \
--container-image=$IMAGE_NAME:latest \