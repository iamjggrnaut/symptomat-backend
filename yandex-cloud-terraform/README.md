
# Yandex Cloud Terraform example

Example terraform configuration for Yandex Cloud.\
[yandex registry](https://registry.terraform.io/providers/yandex-cloud/yandex/latest)\
[yandex terraform-quickstart](https://cloud.yandex.ru/docs/solutions/infrastructure-management/terraform-quickstart)

### Recommended VS Code extentions:

- [HashiCorp.terraform](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform)

## Install

```bash
brew install terraform
brew info terraform
# in project folder
cp variables.tfvars.example.json variables.tfvars.json
cp .envrc.example .envrc
```

## Commands
Validate terraform code:
```bash
terraform validate
```
Show plan to update:
```bash
terraform plan -var-file="variables.tfvars.json"
```
Apply plan to update:
```bash
terraform apply -var-file="variables.tfvars.json"
```
Show terraform output without sensitive data:
```bash
terraform output
```
Show gitlab-ci-auth-key:
```bash
terraform output gitlab-ci-auth-key
```

Example [__variables.tfvars.json__](variables.tfvars.example.json)
