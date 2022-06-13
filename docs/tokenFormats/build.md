# Build

Token formats and restrictions for the `Build` type.

## POST /build/{id}/schedule

A supplier schedules a build of 1-10 parts, each of which is optionally tied to an order.

| Inputs                               | Outputs                                                     |
| :----------------------------------- | :---------------------------------------------------------- |
| Recipe0... RecipeN, Order0... OrderN | Build, Part0... PartN, Recipe0... RecipeN, Order0... OrderN |

### Request body

#### Inputs

`[RECIPE]`
The latest token of each recipe in the build is consumed.

`[ORDER]`
The latest token of each order in the build is consumed. Optional.

#### Outputs

`[RECIPE]`
So that each recipe is available to be used again, a new token for each recipe in the build is created.

| Roles                | Metadata                   |
| :------------------- | :------------------------- |
| Buyer: `BAE`         | `<Literal>` type: `RECIPE` |
| Supplier:`SupplierX` |                            |

`[ORDER]`
So that each order is available to be used again, a new token for each order in the build is created.

| Roles                | Metadata                  |
| :------------------- | :------------------------ |
| Buyer: `BAE`         | `<Literal>` type: `ORDER` |
| Supplier:`SupplierX` |                           |

The `Build` token. Each `recipeN: <TokenId>` matches a `<TokenId>` from the `inputs`. Each `orderN: <TokenId>` matches a `<TokenId>` from the `inputs`.

| Roles                | Metadata                                                          |
| :------------------- | :---------------------------------------------------------------- |
| Owner: `SupplierX`   | `<Literal>` type: `BUILD`                                         |
| Buyer: `BAE`         | `<Literal>` status: `scheduled`                                   |
| Supplier:`SupplierX` | `<Literal>` transactionId: `09000000-0000-1000-8000-000000000000` |
|                      | `<Literal>` completionEstimate: `2023-01-01`                      |
|                      | `<Literal>` externalId: `34-396589-2`                             |
|                      | `<TokenId>` recipe0: `100`                                        |
|                      | `<TokenId>` recipe1: `112`                                        |
|                      | `<TokenId>` recipe2: `163`                                        |
|                      | `<TokenId>` recipe3: `141`                                        |
|                      | `<TokenId>` recipe4: `95`                                         |
|                      | `<TokenId>` recipe5: `156`                                        |
|                      | `<TokenId>` recipe6: `47`                                         |
|                      | `<TokenId>` recipe7: `108`                                        |
|                      | `<TokenId>` recipe8: `34`                                         |
|                      | `<TokenId>` recipe9: `12`                                         |
|                      | `<TokenId>` order0: `350`                                         |
|                      | `<TokenId>` order1: `350`                                         |
|                      | `<TokenId>` order2: `350`                                         |
|                      | `<TokenId>` order3: `350`                                         |
|                      | `<TokenId>` order4: `355`                                         |
|                      | `<TokenId>` order5: `355`                                         |
|                      | `<TokenId>` order6: `421`                                         |
|                      | `<TokenId>` order7: `421`                                         |
|                      | `<TokenId>` order8: `421`                                         |
|                      | `<TokenId>` order9: `421`                                         |

The `Part` token. One for each `recipeN: <TokenId>` in the build.

| Roles                | Metadata                                     |
| :------------------- | :------------------------------------------- |
| Owner: `SupplierX`   | `<Literal>` type: `PART`                     |
| Supplier:`SupplierX` | `<TokenId>` orderId: `180` (optional)        |
|                      | `<TokenId>` recipeId: `125`                  |
|                      | `<TokenId>` buildId: `205`                   |
|                      | `<File>` requiredCerts: `requiredCerts.json` |

### Restrictions

The new `Build` token will have the following restrictions:

```json
{
  "SenderHasOutputRole": [
    {
      "index": 0,
      "role_key": "Supplier"
    }
  ],
  "OutputHasRole": [
    {
      "index": 0,
      "role_key": "Buyer"
    }
  ],
  "FixedOutputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "type",
      "metadata_value": "BUILD"
    },
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "scheduled"
    }
  ],
  "FixedOutputMetadataValueType": [
    {
      "index": 0,
      "metadata_key": "completionEstimate",
      "metadata_value_type": "Literal"
    },
    {
      "index": 0,
      "metadata_key": "transactionId",
      "metadata_value_type": "Literal"
    },
    {
      "index": 0,
      "metadata_key": "externalId",
      "metadata_value_type": "Literal"
    }
  ],
  "FixedOutputMetadataValueType": [
    {
      "index": 0,
      "metadata_key": "recipe0",
      "metadata_value_type": "TokenId"
    },
    // ... for every recipe in the build
    {
      "index": 0,
      "metadata_key": "recipeN",
      "metadata_value_type": "TokenId"
    }
  ]
}
```

For the range of `Recipe` input+output tokens in the build, the following restrictions will apply:

```json
{
  "SenderHasInputRole": [
    {
      "role_key": "Supplier"
    }
  ],
  "MatchInputOutputRole": [
    {
      "input_role_key": "Buyer",
      "output_role_key": "Buyer"
    }
  ],
  "FixedInputMetadataValue": [
    {
      "metadata_key": "type",
      "metadata_value": "RECIPE"
    }
  ],
  "MatchInputOutputMetadataValue": [
    {
      "input_metadata_key": "type",
      "output_metadata_key": "type"
    }
  ]
}
```

For the range of `Order` input+output tokens in the build, the following restrictions will apply:

```json
{
  "SenderHasInputRole": [
    {
      "role_key": "Supplier"
    }
  ],
  "MatchInputOutputRole": [
    {
      "input_role_key": "Buyer",
      "output_role_key": "Buyer"
    }
  ],
  "FixedInputMetadataValue": [
    {
      "metadata_key": "type",
      "metadata_value": "ORDER"
    }
  ],
  "MatchInputOutputMetadataValue": [
    {
      "input_metadata_key": "type",
      "output_metadata_key": "type"
    }
  ]
}
```

For the each `Part` in the build, the following restrictions will apply:

```json
{
  "SenderHasOutputRole": [
    {
      "role_key": "Supplier"
    }
  ],
  "FixedOutputMetadataValueType": [
    {
      "metadata_key": "recipeId",
      "metadata_value_type": "TokenId"
    },
    {
      "metadata_key": "buildId",
      "metadata_value_type": "TokenId"
    }
  ],
  "FixedOutputMetadataValue": [
    {
      "metadata_key": "type",
      "metadata_value": "PART"
    }
  ]
}
```

## POST /build/{id}/start

A supplier starts a build of 1-10 parts.

| Inputs | Outputs |
| :----- | :------ |
| Build  | Build   |

### Request body

#### Inputs

`/build/{id}/schedule`

#### Outputs

| Roles                | Metadata                                     |
| :------------------- | :------------------------------------------- |
| Owner: `SupplierX`   | `<Literal>` type: `BUILD`                    |
| Buyer: `BAE`         | `<Literal>` status: `started`                |
| Supplier:`SupplierX` | `<Literal>` startedAt: `2022-06-10`          |
|                      | `<Literal>` completionEstimate: `2023-01-01` |

### Restrictions

Burning the old + creating the new `Build` token will have the following restrictions:

```json
{
  "FixedNumberOfInputs": [
    {
      "num_inputs": 1
    }
  ],
  "FixedInputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "type",
      "metadata_value": "BUILD"
    },
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "scheduled"
    }
  ],
  "MatchInputOutputRole": [
    {
      "input_index": 0,
      "input_role_key": "Buyer",
      "output_index": 0,
      "output_role_key": "Buyer"
    },
    {
      "input_index": 0,
      "input_role_key": "Supplier",
      "output_index": 0,
      "output_role_key": "Supplier"
    }
  ],
  "MatchInputOutputMetadataValue": [
    {
      "input_index": 0,
      "input_metadata_key": "type",
      "output_index": 0,
      "output_metadata_key": "type"
    }
  ],
  "FixedNumberOfOutputs": [
    {
      "num_outputs": 1
    }
  ],
  "SenderHasOutputRole": [
    {
      "index": 0,
      "role_key": "Supplier"
    }
  ],
  "FixedOutputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "started"
    }
  ]
}
```

## POST /build/{id}/progress-update

A supplier updates progress on a build.

| Inputs | Outputs |
| :----- | :------ |
| Build  | Build   |

### Request body

#### Inputs

`/build/{id}/start || /build/{id}/progress-update`

#### Outputs

| Roles                | Metadata                                     |
| :------------------- | :------------------------------------------- |
| Owner: `SupplierX`   | `<Literal>` type: `BUILD`                    |
| Buyer: `BAE`         | `<File>` buildDataX: `buildData.pdf`         |
| Supplier:`SupplierX` | `<Literal>` completionEstimate: `2023-01-01` |

### Restrictions

Burning the old + creating the new `Build` token will have the following restrictions:

```json
{
  "FixedNumberOfInputs": [
    {
      "num_inputs": 1
    }
  ],
  "FixedNumberOfOutputs": [
    {
      "num_outputs": 1
    }
  ],
  "FixedInputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "type",
      "metadata_value": "BUILD"
    },
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "started"
    }
  ],
  "MatchInputOutputRole": [
    {
      "input_index": 0,
      "input_role_key": "Buyer",
      "output_index": 0,
      "output_role_key": "Buyer"
    },
    {
      "input_index": 0,
      "input_role_key": "Supplier",
      "output_index": 0,
      "output_role_key": "Supplier"
    }
  ],
  "MatchInputOutputMetadataValue": [
    {
      "input_index": 0,
      "input_metadata_key": "type",
      "output_index": 0,
      "output_metadata_key": "type"
    },
    {
      "input_index": 0,
      "input_metadata_key": "status",
      "output_index": 0,
      "output_metadata_key": "status"
    }
  ],
  "SenderHasOutputRole": [
    {
      "index": 0,
      "role_key": "Supplier"
    }
  ]
}
```

## POST /order/{id}/completion

A supplier completes an order.

| Inputs | Outputs |
| :----- | :------ |
| Build  | Build   |

### Request body

#### Inputs

`/order/{id}/start || /order/{id}/progress-update`

#### Outputs

| Roles                | Metadata                              |
| :------------------- | :------------------------------------ |
| Owner: `BAE`         | `<Literal>` type: `BUILD`             |
| Buyer: `BAE`         | `<Literal>` status: `completed`       |
| Supplier:`SupplierX` | `<Literal>` completedAt: `2023-01-01` |
|                      | `<File>` buildDataX: `buildData.pdf`  |

### Restrictions

Burning the old + creating the new `Build` token will have the following restrictions:

```json
{
  "FixedNumberOfInputs": [
    {
      "num_inputs": 1
    }
  ],
  "FixedNumberOfOutputs": [
    {
      "num_outputs": 1
    }
  ],
  "SenderHasOutputRole": [
    {
      "index": 0,
      "role_key": "Supplier"
    }
  ],
  "MatchInputOutputRole": [
    {
      "input_index": 0,
      "input_role_key": "Buyer",
      "output_index": 0,
      "output_role_key": "Buyer"
    },
    {
      "input_index": 0,
      "input_role_key": "Supplier",
      "output_index": 0,
      "output_role_key": "Supplier"
    }
  ],
  "FixedInputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "type",
      "metadata_value": "BUILD"
    },
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "started"
    }
  ],
  "MatchInputOutputMetadataValue": [
    {
      "input_index": 0,
      "input_metadata_key": "type",
      "output_index": 0,
      "output_metadata_key": "type"
    }
  ],
  "FixedOutputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "completed"
    }
  ]
}
```
