# inteli-api

Inteli OpenAPI service for interacting with the DSCP (Digital Supply-Chain Platform)

## Environment Variables

`inteli-api` is configured primarily using environment variables as follows:

| variable                     | required |        default         | description                                                                          |
| :--------------------------- | :------: | :--------------------: | :----------------------------------------------------------------------------------- |
| SERVICE_TYPE                 |    N     |         `info`         | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`] |
| PORT                         |    N     |          `80`          | The port for the API to listen on                                                    |
| LOG_LEVEL                    |    N     |         `info`         | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`] |
| API_VERSION                  |    N     | `package.json version` | API version                                                                          |
| API_MAJOR_VERSION            |    N     |          `v1`          | API major version                                                                    |
| DSCP_API_HOST                |    Y     |           -            | `dscp-api` host                                                                      |
| DSCP_API_PORT                |    Y     |           -            | `dscp-api` port                                                                      |
| DB_HOST                      |    Y     |           -            | PostgreSQL database hostname                                                         |
| DB_PORT                      |    N     |         `5432`         | PostgreSQL database port                                                             |
| DB_NAME                      |    N     |        `inteli`        | PostgreSQL database name                                                             |
| DB_USERNAME                  |    Y     |           -            | PostgreSQL database username                                                         |
| DB_PASSWORD                  |    Y     |           -            | PostgreSQL database password                                                         |
| FILE_UPLOAD_SIZE_LIMIT_BYTES |    N     |  `1024 * 1024 * 100`   | Maximum file size in bytes for upload                                                |
| IDENTITY_SERVICE_HOST        |    Y     |                        | Hostname of the `dscp-identity-service`                                              |
| IDENTITY_SERVICE_PORT        |    Y     |                        | Port of the `dscp-identity-service`                                                  |
| AUTH_TYPE                    |    N     |         `NONE`         | Authentication type for routes on the service. Valid values: [`NONE`, `JWT`]         |

The following environment variables are additionally used when `AUTH_TYPE : 'JWT'`

| variable       | required |                       default                       | description                                                           |
| :------------- | :------: | :-------------------------------------------------: | :-------------------------------------------------------------------- |
| AUTH_JWKS_URI  |    N     | `https://inteli.eu.auth0.com/.well-known/jwks.json` | JSON Web Key Set containing public keys used by the Auth0 API         |
| AUTH_AUDIENCE  |    N     |                    `inteli-dev`                     | Identifier of the Auth0 API                                           |
| AUTH_ISSUER    |    N     |           `https://inteli.eu.auth0.com/`            | Domain of the Auth0 API `                                             |
| AUTH_TOKEN_URL |    N     |      `https://inteli.eu.auth0.com/oauth/token`      | Auth0 API endpoint that issues an Authorisation (Bearer) access token |

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

If `AUTH_TYPE` env is set to `JWT`, the endpoints on `inteli-api` require Bearer Authentication using a JSON Web Token. Tokens are generated externally as an Auth0 Machine to Machine token. You will need to create your own Auth0 API, which can be done for free, and set the appropriate [environment variables](#configuration) (those prefixed with `AUTH`). Follow the start of this [tutorial](https://auth0.com/docs/quickstart/backend/nodejs#configure-auth0-apis) to create an API. Go [here](app/routes/auth.js) and [here](app/auth.js) to see where the environment variables are used.

## Testing

Integration tests for `AUTH_TYPE: 'JWT'` use a preconfigured Auth0 test application and user to authenticate across multiple `dscp` services. Follow the tutorial [here](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-resource-owner-password-flow) to create your own.

Once a test application and user is created, running integration tests locally requires a `/test/test.env` file containing the following environment variables:

| variable                | required | default | description                                        |
| :---------------------- | :------: | :-----: | :------------------------------------------------- |
| AUTH_TEST_USERNAME      |    Y     |    -    | Username of the auth0 user for testing             |
| AUTH_TEST_PASSWORD      |    Y     |    -    | Password of the auth0 user for testing             |
| AUTH_TEST_CLIENT_ID     |    Y     |    -    | Client ID of the auth0 application for testing     |
| AUTH_TEST_CLIENT_SECRET |    Y     |    -    | Client secret of the auth0 application for testing |

Start dependencies with `AUTH_TYPE: 'JWT'`:

```
AUTH_TYPE=JWT docker compose up -d
```

Run tests:

```
npm run test:jwt
```

## API design

`inteli-api` provides a RESTful OpenAPI-based interface for third parties and frontends to interact with the `DSCP` system. In this sense the design prioritises:

1. RESTful design principles. This includes:
   - all endpoints describing discrete operations on path derived entities.
   - use of HTTP verbs to describe whether state is modified, whether the action is idempotent etc.
   - HTTP response codes indicating the correct status of the request.
   - HTTP response bodies including the details of a query response or details about the entity being created/modified.
2. Simplicity of structure. The API should be easily understood by a third party and traversable
3. Simplicity of usage. This includes:
   - all APIs that take request bodies taking a JSON structured request with the exception of attachment upload (which is idiomatically represented as a multipart form).
   - all APIs which return a body returning a JSON structured response (again with the exception of attachments.
4. Abstraction of the underlying DLT components. This means no token Ids, no block numbers etc.
5. Conflict free identifiers. All identifiers must be conflict free as updates can come from third party organisations

### Fundamental entities

These are the top level physical concepts in the system. They will be the top level RESTful path segments. Note that different states of an entity will **NOT** be represented as different top level entities.

- `recipe`
- `orders`
- `build`
- `part`

Additionally there is one more top level entity `attachment` which accepts a `multipart/form-data` payload for uploading a file to IPFS. This returns an `attachmentId` that can then be used when preparing entity updates to attach files.

### Entity queries

Entity queries allow the API user to list those entities including a query and to get a specific entity. For `order` for example:

- `GET /order` - list orders
- `GET /order/{orderId}` - get order

### Entity creation

Allows the creation of an initial local state for an entity. Note this is essentially just to establish an internal identifier for the entity and **the state is not shared across the blockchain network at this point**.

- `POST /order`

### Entity updates

Allows different kind of updates to be prepared and applied to an entity. For example, an `order` must be submitted via a `submission` action. Each update can have specific files attached along with other specific metadata.

- `POST /order/{orderId}/submission` - create an order `submission` action and send it to the blockchain
- `GET /order/{orderId}/submission` - list order `submissions` and their status
- `GET /order/{orderId}/submission/{submissiond}` - get the details of an order `submission`

### Attachment API

The last top level entity `attachment` which accepts a `multipart/form-data` payload for uploading a file to IPFS. This will return a attachmentId that can then be used when preparing entity updates to attach files.

- `POST /attachment`
- `GET /attachment/{attachmentId}`

## Demo scenarios

Demoing the routes in `inteli-api` involves two personas.
