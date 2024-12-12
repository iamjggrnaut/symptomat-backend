variable "YANDEX_ACCESS_KEY_ID" {
  type = string
}

variable "YANDEX_SECRET_ACCESS_KEY" {
  type = string
}

variable "YANDEX_CLOUD_ID" {
  type        = string
  description = "Идентификатор облака (Главная страница)"
  validation {
    condition     = length(var.YANDEX_CLOUD_ID) == 20
    error_message = "Идентификатор облака должен быть равен 20 символам."
  }
}

variable "YANDEX_FOLDER_ID" {
  type        = string
  description = "Идентификатор каталога (Главная страница)"
  validation {
    condition     = length(var.YANDEX_FOLDER_ID) == 20
    error_message = "Идентификатор каталога должен быть равен 20 символам."
  }
}

variable "YANDEX_OAUTH_TOKEN" {
  type        = string
  description = "OAuth-токен для работы с Yandex.Cloud"
  # https://cloud.yandex.ru/docs/iam/concepts/authorization/oauth-token
}

variable "NETWORK_ID" {
  type        = string
  description = "Идентификатор сети (Главная страница в Virtual Private Cloud)"
}

variable "SUBNET_ID" {
  type        = string
  description = "Идентификатор подсети для зоны доступности (Страница сети NETWORK_ID в Virtual Private Cloud)"
}

variable "AVAILABILITY_ZONE" {
  default     = "ru-central1-a"
  type        = string
  description = "Зона доступности (Страница сети NETWORK_ID в Virtual Private Cloud)"
  validation {
    condition     = contains(["ru-central1-a", "ru-central1-b", "ru-central1-c"], var.AVAILABILITY_ZONE)
    error_message = "Зона доступности может быть \"a\", \"b\", or \"c\"."
  }
}

variable "PRIVATE_BUCKET" {
  type        = string
  default     = "private"
  description = "Имя бакета для приватных файлов"
}

variable "PUBLIC_BUCKET" {
  type        = string
  default     = "public"
  description = "Имя бакета для публичных файлов"
}

variable "DEVELOP_ADMIN_PANEL_BUCKET" {
  type        = string
  default     = "public"
  description = "Имя бакета для develop admin panel"
}

variable "STAGING_ADMIN_PANEL_BUCKET" {
  type        = string
  default     = "public"
  description = "Имя бакета для staging admin panel"
}

variable "DEVELOP_DOCTOR_BUCKET" {
  type        = string
  default     = "public"
  description = "Имя бакета для doctor"
}

variable "STAGING_DOCTOR_BUCKET" {
  type        = string
  default     = "public"
  description = "Имя бакета для doctor"
}

variable "DEVELOP_MANAGER_BUCKET" {
  type        = string
  default     = "public"
  description = "Имя бакета для manager"
}

variable "STAGING_MANAGER_BUCKET" {
  type        = string
  default     = "public"
  description = "Имя бакета для manager"
}

variable "STAGING_POSTGRESQL_CLUSTER_DATABASE_NAME" {
  type        = string
  default     = "purrweb"
  description = "Имя базы данных"
}

variable "DEVELOP_POSTGRESQL_CLUSTER_DATABASE_NAME" {
  type        = string
  default     = "develop"
  description = "Имя базы данных"
}

variable "STAGING_POSTGRESQL_CLUSTER_DATABASE_USER" {
  type        = string
  default     = "purrweb"
  description = "Имя пользователя(владельца) базы данных"
}

variable "STAGING_POSTGRESQL_CLUSTER_DATABASE_PASSWORD" {
  type        = string
  description = "Пароль от базы данных"
}

variable "STAGING_REDIS_CLUSTER_DATABASE_PASSWORD" {
  type        = string
  description = "Пароль от базы данных"
}
