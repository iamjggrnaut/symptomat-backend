resource "yandex_iam_service_account" "cr-image-puller-account" {
  name        = "cr-image-puller"
  description = "Сервисный аккаунт для COI"
}

resource "yandex_iam_service_account" "gitlab-ci-account" {
  name        = "gitlab-ci"
  description = "Сервисный аккаунт для GitLab CI"
}

resource "yandex_resourcemanager_folder_iam_member" "image-puller" {
  folder_id = var.YANDEX_FOLDER_ID
  role      = "container-registry.images.puller"
  member    = "serviceAccount:${yandex_iam_service_account.cr-image-puller-account.id}"

  depends_on = [
    yandex_iam_service_account.cr-image-puller-account
  ]
}

resource "yandex_resourcemanager_folder_iam_member" "gitlab-ci-image-pusher" {
  folder_id = var.YANDEX_FOLDER_ID
  role      = "container-registry.images.pusher"
  member    = "serviceAccount:${yandex_iam_service_account.gitlab-ci-account.id}"

  depends_on = [
    yandex_iam_service_account.gitlab-ci-account
  ]
}

resource "yandex_resourcemanager_folder_iam_member" "gitlab-ci-compute-admin" {
  folder_id = var.YANDEX_FOLDER_ID
  role      = "compute.admin"
  member    = "serviceAccount:${yandex_iam_service_account.gitlab-ci-account.id}"

  depends_on = [
    yandex_iam_service_account.gitlab-ci-account
  ]
}

resource "yandex_iam_service_account_key" "gitlab-ci-auth-key" {
  service_account_id = yandex_iam_service_account.gitlab-ci-account.id
  description        = "Авторизованный ключ для gitlab-ci"
  key_algorithm      = "RSA_2048"

  depends_on = [
    yandex_iam_service_account.gitlab-ci-account
  ]
}

