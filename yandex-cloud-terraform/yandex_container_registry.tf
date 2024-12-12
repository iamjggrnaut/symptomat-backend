resource "yandex_container_registry" "ycr-backend" {
  name      = "backend"
  folder_id = var.YANDEX_FOLDER_ID
}
