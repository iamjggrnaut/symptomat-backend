import Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  ENVIRONMENT: Joi.string().valid('development', 'production', 'staging').required(),
  PORT: Joi.number().port().required(),
  CORS_CLIENT_URLS: Joi.string().required(),
  SELF_API_URL: Joi.string().required(),
  GQL_PLAYGROUND_ENABLE: Joi.boolean().required(),
  GQL_INTROSPECTION_ENABLE: Joi.boolean().required(),
  GQL_TRACING_ENABLE: Joi.boolean().required(),
  // jwt
  JWT_SECRET: Joi.string().required(),
  JWT_SECRET_EXPIRES_IN: Joi.number().integer().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET_EXPIRES_IN: Joi.string().required(),
  // database
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().port().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  // redis
  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_MASTER_NAME: Joi.string().allow('').optional(),
  // aws
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  // s3
  S3_REGION_NAME: Joi.string().required(),
  S3_PUBLIC_BUCKET_NAME: Joi.string().required(),
  S3_PRIVATE_BUCKET_NAME: Joi.string().required(),
  S3_PUT_ACTION_EXPIRES_SEC: Joi.number().integer().required(),
  S3_GET_ACTION_EXPIRES_SEC: Joi.number().integer().required(),
  S3_PRIVATE_URL: Joi.string().required(),
  S3_PUBLIC_URL: Joi.string().required(),
  S3_ENDPOINT: Joi.string().required(),
  // sentry
  SENTRY_DSN: Joi.string().required(),
  SENTRY_ENV: Joi.string().valid('development', 'production', 'staging').required(),
  MAILGUN_DOMAIN: Joi.string().required(),
  MAILGUN_PRIVATE_KEY: Joi.string().required(),
  MAILGUN_SUPPORT_EMAIL: Joi.string().required(),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const configuration = () => ({
  env: process.env.NODE_ENV,
  environment: process.env.ENVIRONMENT,
  port: parseInt(process.env.PORT, 10),
  corsClientUrls: process.env.CORS_CLIENT_URLS.split(','),
  selfApiUrl: process.env.SELF_API_URL,
  gqlPlaygroundEnable: process.env.GQL_PLAYGROUND_ENABLE === 'true',
  gqlIntrospectionEnable: process.env.GQL_INTROSPECTION_ENABLE === 'true',
  gqlTracingEnable: process.env.GQL_TRACING_ENABLE === 'true',
  applicationName: process.env.APPLICATION_NAME,
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: parseInt(process.env.JWT_SECRET_EXPIRES_IN, 10),
    refreshExpiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN,
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    masterName: process.env.REDIS_MASTER_NAME,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  s3: {
    region: process.env.S3_REGION_NAME,
    publicBucket: process.env.S3_PUBLIC_BUCKET_NAME,
    privateBucket: process.env.S3_PRIVATE_BUCKET_NAME,
    putActionExpiresSec: parseInt(process.env.S3_PUT_ACTION_EXPIRES_SEC, 10),
    getActionExpiresSec: parseInt(process.env.S3_GET_ACTION_EXPIRES_SEC, 10),
    publicUrl: process.env.S3_PUBLIC_URL,
    privateUrl: process.env.S3_PRIVATE_URL,
    endpoint: process.env.S3_ENDPOINT,
  },
  sentry: {
    dns: process.env.SENTRY_DSN,
    env: process.env.SENTRY_ENV,
  },
  mailgun: {
    apiKey: process.env.MAILGUN_PRIVATE_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    supportEmail: process.env.MAILGUN_SUPPORT_EMAIL,
  },
  links: {
    frontendSignUpLink: process.env.FRONTEND_SIGN_UP_LINK,
    frontendResetPasswordLink: process.env.FRONTEND_RESET_PASSWORD_LINK,
    frontendSignInLink: process.env.FRONTEND_SIGN_IN_LINK,
    frontendManagerSignInLink: process.env.FRONTEND_MANAGER_SIGN_IN_LINK,
    frontendUrl: process.env.FRONTEND_URL,
    appStoreLink: process.env.APP_STORE_LINK,
    googlePlayLink: process.env.GOOGLE_PLAY_LINK,
  },
});

export const validationOptions = {
  abortEarly: true,
};
