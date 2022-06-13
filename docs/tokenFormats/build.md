# Build

Token formats and restrictions for the `Build` type

## POST /build/{id}/schedule

A supplier schedules a build of 1-10 parts that is optionally tied to an order

| Inputs                               | Outputs                                     |
| :----------------------------------- | :------------------------------------------ |
| Recipe0... RecipeN, Order0... OrderN | Recipe0... RecipeN, Order0... OrderN, Build |

### Request body

#### Inputs

`[RECIPE]`
The latest token of each recipe in the build is consumed.

`[ORDER]`
The latest token of each order in the build is consumed.

#### Outputs

`[RECIPE]`
So that the recipe is available to be used again, a new token for each recipe in the build is created.

| Roles                | Metadata                   |
| :------------------- | :------------------------- |
| Owner: `BAE`         | `<Literal>` type: `RECIPE` |
| Buyer: `BAE`         |                            |
| Supplier:`SupplierX` |                            |

`[ORDER]`
So that the order is available to be used again, a new token for each order in the build is created.

| Roles                | Metadata                  |
| :------------------- | :------------------------ |
| Buyer: `BAE`         | `<Literal>` type: `ORDER` |
| Supplier:`SupplierX` |                           |

| Roles                | Metadata                                                          |
| :------------------- | :---------------------------------------------------------------- |
| Owner: `SupplierX`   | `<Literal>` type: `BUILD`                                         |
| Buyer: `BAE`         | `<Literal>` status: `scheduled`                                   |
| Supplier:`SupplierX` | `<Literal>` transactionId: `09000000-0000-1000-8000-000000000000` |
|                      | `<Literal>` completionEstimate: `2023-01-01`                      |
|                      | `<Literal>` externalId: `34-396589-2`                             |
|                      | `<TokenId>` recipe0: `100`                                        |
|                      | `<TokenId>` recipe1: `112` (optional)                             |
|                      | `<TokenId>` recipe2: `163` (optional)                             |
|                      | `<TokenId>` recipe3: `141` (optional)                             |
|                      | `<TokenId>` recipe4: `95` (optional)                              |
|                      | `<TokenId>` recipe5: `156` (optional)                             |
|                      | `<TokenId>` recipe6: `47` (optional)                              |
|                      | `<TokenId>` recipe7: `108` (optional)                             |
|                      | `<TokenId>` recipe8: `34` (optional)                              |
|                      | `<TokenId>` recipe9: `12` (optional)                              |
|                      | `<TokenId>` order0: `350` (optional)                              |
|                      | `<TokenId>` order1: `350` (optional)                              |
|                      | `<TokenId>` order2: `350` (optional)                              |
|                      | `<TokenId>` order3: `350` (optional)                              |
|                      | `<TokenId>` order4: `355` (optional)                              |
|                      | `<TokenId>` order5: `355` (optional)                              |
|                      | `<TokenId>` order6: `421` (optional)                              |
|                      | `<TokenId>` order7: `421` (optional)                              |
|                      | `<TokenId>` order8: `421` (optional)                              |
|                      | `<TokenId>` order9: `421` (optional)                              |

### Restrictions

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
  ]
}
```

The following restrictions scale based on `X` number of recipes and `Y` number of orders.

```json
{
  "SenderHasInputRole": [
    {
      "index": 0,
      "role_key": "Supplier"
    },
    //...
    {
      "index": "X+Y-1",
      "role_key": "Supplier"
    }
  ],
  "MatchInputOutputRole": [
    {
      "input_index": 0,
      "input_role_key": "Supplier",
      "output_index": 0,
      "output_role_key": "Supplier"
    },
    // ...
    {
      "input_index": "X+Y-1",
      "input_role_key": "Supplier",
      "output_index": "X+Y-1",
      "output_role_key": "Supplier"
    }
  ],
  "FixedInputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "type",
      "metadata_value": "RECIPE"
    },
    // ...
    {
      "index": "X-1",
      "metadata_key": "type",
      "metadata_value": "RECIPE"
    },
    {
      "index": "X",
      "metadata_key": "type",
      "metadata_value": "ORDER"
    },
    // ...
    {
      "index": "X+Y-1",
      "metadata_key": "type",
      "metadata_value": "ORDER"
    }
  ],
  "MatchInputOutputMetadataValue": [
    {
      "input_index": 0,
      "input_metadata_key": "type",
      "output_index": 0,
      "output_metadata_key": "type"
    },
    // ...
    {
      "input_index": "X+Y-1",
      "input_metadata_key": "type",
      "output_index": "X+Y-1",
      "output_metadata_key": "type"
    }
  ],
  "FixedOutputMetadataValueType": [
    {
      "index": "X+Y",
      "metadata_key": "recipe0",
      "metadata_value_type": "TokenId"
    },
    // ...
    {
      "index": "X+Y",
      "metadata_key": "recipeX",
      "metadata_value_type": "TokenId"
    },
    {
      "index": "X+Y",
      "metadata_key": "order0",
      "metadata_value_type": "TokenId"
    },
    // ...
    {
      "index": "X+Y",
      "metadata_key": "orderY",
      "metadata_value_type": "TokenId"
    }
  ]
}
```

## POST /build/{id}/start

A supplier starts a build of 1-10 parts.

| Inputs | Outputs        |
| :----- | :------------- |
| Build  | Part0... PartN |

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

The following restrictions scale based on `N` number of recipes.

```json
{
  "SenderHasOutputRole": [
    {
      "index": 1,
      "role_key": "Supplier"
    },
    // ...
    {
      "index": "N",
      "role_key": "Supplier"
    }
  ],
  "FixedOutputMetadataValueType": [
    {
      "index": 1,
      "metadata_key": "recipeId",
      "metadata_value_type": "TokenId"
    },
    {
      "index": 1,
      "metadata_key": "buildId",
      "metadata_value_type": "TokenId"
    },
    // ...
    {
      "index": "N",
      "metadata_key": "recipeId",
      "metadata_value_type": "TokenId"
    },
    {
      "index": "N",
      "metadata_key": "buildId",
      "metadata_value_type": "TokenId"
    }
  ],
  "FixedOutputMetadataValue": [
    {
      "index": 1,
      "metadata_key": "type",
      "metadata_value": "PART"
    },
    // ...
    {
      "index": "N",
      "metadata_key": "type",
      "metadata_value": "PART"
    }
  ]
}
```

## POST /build/{id}/progress-update

A supplier updates progress on a build.

### Request body

#### Inputs

`/build/{id}/start | /build/{id}/progress-update`

#### Outputs

| Roles                | Metadata                                     |
| :------------------- | :------------------------------------------- |
| Owner: `SupplierX`   | `<Literal>` type: `BUILD`                    |
| Buyer: `BAE`         | `<File>` buildDataX: `buildData.pdf`         |
| Supplier:`SupplierX` | `<Literal>` completionEstimate: `2023-01-01` |

### Restrictions

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
  ]
}
```

## POST /order/{id}/completion

A supplier completes an order.

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
      "metadata_value": "completed"
    }
  ]
}
```
