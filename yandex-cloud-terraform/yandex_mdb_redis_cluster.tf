resource "yandex_mdb_redis_cluster" "staging" {
  name        = "staging"
  environment = "PRODUCTION"
  network_id  = var.NETWORK_ID
  tls_enabled = false
  sharded     = false

  config {
    password = var.STAGING_REDIS_CLUSTER_DATABASE_PASSWORD
    version  = "6.0"
  }

  resources {
    resource_preset_id = "b2.nano"
    disk_size          = 4
  }

  host {
    zone      = var.AVAILABILITY_ZONE
    subnet_id = var.SUBNET_ID
  }
}
