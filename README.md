# medical-surveys-api

## Run

```
yarn install
yarn dc-up
yarn start:dev
```

### Scripts

- `yarn seeds:all` - run seeds all entities
  _options_:
  `-s` - option to specify a specific seeder class to run individually
  _example_:

  ```
  yarn seeds -s CreateManyEntities
  ```

- generate module\
_install_ _[generator-purrweb-nestjs](https://gitlab.com/purrweb/codestyle/generator-purrweb-nestjs)_
   ```
   yo purrweb-nestjs:module
   ```

### Stack

- nest js (Graphql code first)
- typeorm (PostgreSQL)
- passport-jwt
- ioredis
- firebase (for push notifiactions)

### Deploy (manual)

1.  Install

- [yc cli](https://cloud.yandex.ru/docs/cli/quickstart)
- [docker-credential-yc](https://cloud.yandex.ru/docs/container-registry/operations/authentication#ch-setting)

2. Create profile surveys\
   run `yc init`\
   for check, run `yc config list`
3. Configure Docker\
   run `yc container registry configure-docker --profile surveys`
4. run `.yc_deploy_staging.sh`
5. update COI Docker image

### Tips for YandexCloud
__Auto-remove old docker images__
 - Connect to your Linux instance using SSH
- Run
```bash
sudo -i
echo "0 */12 * * * docker images -q |xargs docker rmi" | crontab -
```
