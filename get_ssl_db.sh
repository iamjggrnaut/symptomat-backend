#!/bin/bash
cd yandex &&
wget "https://storage.yandexcloud.net/cloud-certs/CA.pem" -O root.crt && \
chmod 0600 root.crt