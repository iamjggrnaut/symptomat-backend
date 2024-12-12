# YANDEX
# https://registry.terraform.io/providers/yandex-cloud/yandex/latest
# TERRAFORM
# Guide - https://cloud.yandex.ru/docs/solutions/infrastructure-management/terraform-quickstart
terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }

  backend "s3" {
    endpoint                    = "storage.yandexcloud.net"
    bucket                      = "surveys-terraform-state"
    region                      = "ru-central1"
    key                         = "surveys.tfstate"
    skip_region_validation      = true
    skip_credentials_validation = true
  }
}

provider "yandex" {
  token              = var.YANDEX_OAUTH_TOKEN
  cloud_id           = var.YANDEX_CLOUD_ID
  folder_id          = var.YANDEX_FOLDER_ID
  zone               = var.AVAILABILITY_ZONE
  storage_access_key = var.YANDEX_ACCESS_KEY_ID
  storage_secret_key = var.YANDEX_SECRET_ACCESS_KEY
}

