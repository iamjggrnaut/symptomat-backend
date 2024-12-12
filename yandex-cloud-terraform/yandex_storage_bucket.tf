resource "yandex_storage_bucket" "staging-public-bucket" {
  bucket = var.PUBLIC_BUCKET
  acl    = "public-read"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 0
  }
}

resource "yandex_storage_bucket" "staging-private-bucket" {
  bucket = var.PRIVATE_BUCKET
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 0
  }
}

resource "yandex_storage_bucket" "develop-admin-panel-bucket" {
  bucket = var.DEVELOP_ADMIN_PANEL_BUCKET
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "yandex_storage_bucket" "staging-admin-panel-bucket" {
  bucket = var.STAGING_ADMIN_PANEL_BUCKET
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "yandex_storage_bucket" "develop-doctor-bucket" {
  bucket = var.DEVELOP_DOCTOR_BUCKET
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "yandex_storage_bucket" "staging-doctor-bucket" {
  bucket = var.STAGING_DOCTOR_BUCKET
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "yandex_storage_bucket" "develop-manager-bucket" {
  bucket = var.DEVELOP_MANAGER_BUCKET
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "yandex_storage_bucket" "staging-manager-bucket" {
  bucket = var.STAGING_MANAGER_BUCKET
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}
