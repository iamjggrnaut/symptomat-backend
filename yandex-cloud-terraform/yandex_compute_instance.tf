data "yandex_compute_image" "container-optimized-image" {
  family = "container-optimized-image"
}

resource "yandex_compute_instance" "coi-staging" {
  service_account_id = yandex_iam_service_account.cr-image-puller-account.id
  zone               = var.AVAILABILITY_ZONE
  name               = "staging-backend"

  boot_disk {
    initialize_params {
      image_id = data.yandex_compute_image.container-optimized-image.id
      size     = 30
      type     = "network-ssd"
    }
  }

  network_interface {
    subnet_id = var.SUBNET_ID
    nat       = true
  }

  resources {
    cores         = 2
    memory        = 1
    core_fraction = 20
  }

  metadata = {
    docker-container-declaration = file("${path.module}/declaration.yaml")
    user-data                    = file("${path.module}/cloud_config.yaml")
    ssh-keys                     = "purrweb:${file("id_rsa.pub")}"
  }

  depends_on = [
    yandex_iam_service_account.cr-image-puller-account
  ]
}
