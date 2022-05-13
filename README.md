# inteli-api

Inteli OpenAPI service for interacting with the DSCP (Digital Supply-Chain Platform)

## Environment Variables

`inteli-api` is configured primarily using environment variables as follows:

| variable                     | required |                       default                       | description                                                                          |
| :--------------------------- | :------: | :-------------------------------------------------: | :----------------------------------------------------------------------------------- |
| SERVICE_TYPE                 |    N     |                       `info`                        | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`] |
| PORT                         |    N     |                       `3001`                        | The port for the API to listen on                                                    |
| LOG_LEVEL                    |    N     |                       `info`                        | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`] |
| API_VERSION                  |    N     |                          -                          | API version                                                                          |
| API_MAJOR_VERSION            |    N     |                          -                          | API major version                                                                    |
| DSCP_API_HOST                |    N     |                     `localhost`                     | `dscp-api` host                                                                      |
| DSCP_API_PORT                |    N     |                       `3001`                        | `dscp-api` port                                                                      |
| DB_HOST                      |    Y     |                          -                          | PostgreSQL database hostname                                                         |
| DB_PORT                      |    N     |                       `5432`                        | PostgreSQL database port                                                             |
| DB_NAME                      |    N     |                      `inteli`                       | PostgreSQL database name                                                             |
| DB_USERNAME                  |    Y     |                          -                          | PostgreSQL database username                                                         |
| DB_PASSWORD                  |    Y     |                          -                          | PostgreSQL database password                                                         |
| FILE_UPLOAD_SIZE_LIMIT_BYTES |    N     |                 `1024 * 1024 * 100`                 | Maximum file size in bytes for upload                                                |
| AUTH_JWKS_URI                |    N     | `https://inteli.eu.auth0.com/.well-known/jwks.json` | JSON Web Key Set containing public keys used by the Auth0 API                        |
| AUTH_AUDIENCE                |    N     |                    `inteli-dev`                     | Identifier of the Auth0 API                                                          |
| AUTH_ISSUER                  |    N     |           `https://inteli.eu.auth0.com/`            | Domain of the Auth0 API `                                                            |
| AUTH_TOKEN_URL               |    N     |      `https://inteli.eu.auth0.com/oauth/token`      | Auth0 API endpoint that issues an Authorisation (Bearer) access token                |
| IDENTITY_SERVICE_HOST        |    Y     |                                                     | Hostname of the `dscp-identity-service`                                              |
| IDENTITY_SERVICE_PORT        |    Y     |                                                     | Port of the `dscp-identity-service`                                                  |

## Getting started

To start dependencies

```
docker-compose up -d
```

Run DB migrations

```
npx knex migrate:latest --env test
```

Run the application in development mode:

```sh
npm run dev
```

## Authentication

The endpoints on `inteli-api` require Bearer Authentication using a JSON Web Token. Tokens are generated externally as an Auth0 Machine to Machine token. You will need to create your own Auth0 API, which can be done for free, and set the appropriate [environment variables](#configuration) (those prefixed with `AUTH`). Follow the start of this [tutorial](https://auth0.com/docs/quickstart/backend/nodejs#configure-auth0-apis) to create an API. Go [here](app/routes/auth.js) and [here](app/auth.js) to see where the environment variables are used.

## Testing

Integration tests use a preconfigured Auth0 test application and user to authenticate across multiple `dscp` services. Follow the tutorial [here](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-resource-owner-password-flow) to create your own.

Once a test application and user is created, running integration tests locally requires a `/test/test.env` file containing the following environment variables:

| variable                | required | default | description                                        |
| :---------------------- | :------: | :-----: | :------------------------------------------------- |
| AUTH_TEST_USERNAME      |    Y     |    -    | Username of the auth0 user for testing             |
| AUTH_TEST_PASSWORD      |    Y     |    -    | Password of the auth0 user for testing             |
| AUTH_TEST_CLIENT_ID     |    Y     |    -    | Client ID of the auth0 application for testing     |
| AUTH_TEST_CLIENT_SECRET |    Y     |    -    | Client secret of the auth0 application for testing |
