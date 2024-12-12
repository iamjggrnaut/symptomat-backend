#!/bin/bash
REPO_NAME=crpj8g5ls3uaff6hv7pc
IMAGE_NAME=medical-surveys-staging

echo "Replace .env:"
sh ./update-env-file.sh .env.staging

echo "Docker build:"
yarn build & docker build -t $IMAGE_NAME .

echo "Docker tag:"
docker tag $IMAGE_NAME:latest cr.yandex/$REPO_NAME/$IMAGE_NAME:latest

echo "Docker push:"
docker push cr.yandex/$REPO_NAME/$IMAGE_NAME:latest