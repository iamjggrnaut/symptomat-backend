output "coi-staging-ip" {
  value = yandex_compute_instance.coi-staging.network_interface.0.nat_ip_address
}

output "cr-image-puller-account-id" {
  value = yandex_iam_service_account.cr-image-puller-account.id
}

output "gitlab-ci-account-id" {
  value = yandex_iam_service_account.gitlab-ci-account.id
}

output "postgresql-cluster-staging-host" {
  value = yandex_mdb_postgresql_cluster.staging.host[0].fqdn
}

output "redis-cluster-staging-host" {
  value = yandex_mdb_redis_cluster.staging.host[0].fqdn
}

output "develop-admin-panel-website-endpoint" {
  value = yandex_storage_bucket.develop-admin-panel-bucket.website_endpoint
}

output "staging-admin-panel-website-endpoint" {
  value = yandex_storage_bucket.staging-admin-panel-bucket.website_endpoint
}

output "gitlab-ci-auth-key" {
  value     = yandex_iam_service_account_key.gitlab-ci-auth-key
  sensitive = true
}
