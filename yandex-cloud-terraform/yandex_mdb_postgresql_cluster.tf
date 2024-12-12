resource "yandex_mdb_postgresql_cluster" "staging" {
  name        = "staging"
  environment = "PRODUCTION"
  network_id  = var.NETWORK_ID

  config {
    version = "13"

    resources {
      resource_preset_id = "b2.nano"
      disk_type_id       = "network-ssd"
      disk_size          = "10"
    }

    postgresql_config = {
      timezone = "UTC"
    }
  }

  database {
    name       = var.STAGING_POSTGRESQL_CLUSTER_DATABASE_NAME
    owner      = var.STAGING_POSTGRESQL_CLUSTER_DATABASE_USER
    lc_collate = "C"
    lc_type    = "ru_RU.UTF-8"

    extension {
      name = "uuid-ossp"
    }
  }

  user {
    name     = var.STAGING_POSTGRESQL_CLUSTER_DATABASE_USER
    password = var.STAGING_POSTGRESQL_CLUSTER_DATABASE_PASSWORD
    permission {
      database_name = var.STAGING_POSTGRESQL_CLUSTER_DATABASE_NAME
    }
  }

  host {
    zone             = var.AVAILABILITY_ZONE
    subnet_id        = var.SUBNET_ID
    assign_public_ip = true
  }
}
