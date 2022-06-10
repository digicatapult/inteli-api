# Order

Token formats and restrictions for the `Order` type.

## POST /order/{id}/submission

A buyer submits an order consisting of 1-10 recipes from a supplier.

| Inputs                      | Outputs                            |
| :-------------------------- | :--------------------------------- |
| Recipe0, Recipe1... RecipeN | Recipe0, Recipe1... RecipeN, Order |

### Request body

#### Inputs

`[RECIPE]`
The latest token of each recipe in the order is consumed.

#### Outputs

`[RECIPE]`
So that the recipe is available to be used again, a new token for each recipe in the order is created.

| Roles                | Metadata                 |
| :------------------- | :----------------------- |
| Owner: `BAE`         | <Literal> type: `RECIPE` |
| Buyer: `BAE`         |                          |
| Supplier:`SupplierX` |                          |

The `ORDER` token. Each `recipeN: <TokenId>` matches a `<TokenId>` from the `inputs`.

| Roles                | Metadata                                                        |
| :------------------- | :-------------------------------------------------------------- |
| Owner: `SupplierX`   | <Literal> type: `ORDER`                                         |
| Buyer: `BAE`         | <Literal> status: `submitted`                                   |
| Supplier:`SupplierX` | <Literal> transactionId: `09000000-0000-1000-8000-000000000000` |
|                      | <Literal> requiredBy: `2023-01-01`                              |
|                      | <TokenId> recipe0: `100`                                        |
|                      | <TokenId> recipe1: `112` (optional)                             |
|                      | <TokenId> recipe2: `163` (optional)                             |
|                      | <TokenId> recipe3: `141` (optional)                             |
|                      | <TokenId> recipe4: `95` (optional)                              |
|                      | <TokenId> recipe5: `156` (optional)                             |
|                      | <TokenId> recipe6: `47` (optional)                              |
|                      | <TokenId> recipe7: `108` (optional)                             |
|                      | <TokenId> recipe8: `34` (optional)                              |
|                      | <TokenId> recipe9: `12` (optional)                              |

### Restrictions

```json
{
  "SenderHasOutputRole": [
    {
      "index": 0,
      "role_key": "Buyer"
    }
  ],
  "OutputHasRole": [
    {
      "index": 0,
      "role_key": "Supplier"
    }
  ],
  "FixedOutputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "type",
      "metadata_value": "ORDER"
    },
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "submitted"
    }
  ],
  "FixedOutputMetadataValueType": [
    {
      "index": 0,
      "metadata_key": "requiredBy",
      "metadata_value_type": "Literal"
    },
    {
      "index": 0,
      "metadata_key": "transactionId",
      "metadata_value_type": "Literal"
    }
  ]
}
```

The following restrictions scale based on `N` number of recipes

```json
{
  "SenderHasInputRole": [
    {
      "index": 0,
      "role_key": "Buyer"
    },
    //...
    {
      "index": "N",
      "role_key": "Buyer"
    }
  ],
  "FixedNumberOfInputs": [
    {
      "num_inputs": "N"
    }
  ],
  "FixedNumberOfOutputs": [
    {
      "num_outputs": "N + 1"
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
      "input_index": "N",
      "input_role_key": "Supplier",
      "output_index": "N",
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
      "index": "N",
      "metadata_key": "type",
      "metadata_value": "RECIPE"
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
      "input_index": "N",
      "input_metadata_key": "type",
      "output_index": "N",
      "output_metadata_key": "type"
    }
  ],
  "FixedOutputMetadataValueType": [
    {
      "index": 0,
      "metadata_key": "recipe0",
      "metadata_value_type": "TokenId"
    },
    // ...
    {
      "index": 0,
      "metadata_key": "recipeN",
      "metadata_value_type": "TokenId"
    }
  ]
}
```

## POST /order/{id}/rejection

A supplier rejects an order, along with amendment suggestions.

### Request body

#### Inputs

`[/order/{id}/submission]`

`[RECIPE]`
The latest token of each recipe in the order is consumed.

#### Outputs

`[RECIPE]`
So that the recipe is available to be used again, a new token for each recipe in the order is created.

| Roles                | Metadata                 |
| :------------------- | :----------------------- |
| Owner: `BAE`         | <Literal> type: `RECIPE` |
| Buyer: `BAE`         |                          |
| Supplier:`SupplierX` |                          |

The `ORDER` token. Each `recipeN: <TokenId>` matches a `<TokenId>` from the `inputs`.

| Roles                | Metadata                            |
| :------------------- | :---------------------------------- |
| Owner: `BAE`         | <Literal> type: `ORDER`             |
| Buyer: `BAE`         | <Literal> status: `rejected`        |
| Supplier:`SupplierX` | <Literal> requiredBy: `2023-01-01`  |
|                      | <TokenId> recipe0: `100`            |
|                      | <TokenId> recipe1: `112` (optional) |
|                      | <TokenId> recipe2: `163` (optional) |
|                      | <TokenId> recipe3: `141` (optional) |
|                      | <TokenId> recipe4: `95` (optional)  |
|                      | <TokenId> recipe5: `156` (optional) |
|                      | <TokenId> recipe6: `47` (optional)  |
|                      | <TokenId> recipe7: `108` (optional) |
|                      | <TokenId> recipe8: `34` (optional)  |
|                      | <TokenId> recipe9: `12` (optional)  |

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
      "metadata_value": "ORDER"
    },
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "submitted"
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
      "metadata_value": "rejected"
    }
  ],
  "FixedOutputMetadataValueType": [
    {
      "index": 0,
      "metadata_key": "requiredBy",
      "metadata_value_type": "Literal"
    },
    {
      "index": 0,
      "metadata_key": "recipe0",
      "metadata_value_type": "TokenId"
    }
  ]
}
```

## POST /order/{id}/amendment

A buyer agrees to amend an order following a supplier's rejection.

### Request body

#### Inputs

`[/order/{id}/rejection]`

#### Outputs

| Roles                | Metadata                    |
| :------------------- | :-------------------------- |
| Owner: `SupplierX`   | <Literal> type: `ORDER`     |
| Buyer: `BAE`         | <Literal> status: `amended` |
| Supplier:`SupplierX` |                             |

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
      "metadata_value": "ORDER"
    },
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "amended"
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
      "role_key": "Buyer"
    }
  ],
  "FixedOutputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "status",
      "metadata_value": "amended"
    }
  ]
}
```

## POST /order/{id}/acceptance

A supplier accepts an order.

### Request body

#### Inputs

`[/order/{id}/submission || /order/{id}/amendment]`

#### Outputs

| Roles                | Metadata                     |
| :------------------- | :--------------------------- |
| Owner: `BAE`         | <Literal> type: `ORDER`      |
| Buyer: `BAE`         | <Literal> status: `accepted` |
| Supplier:`SupplierX` |                              |

### Restrictions

```json
{
  "FixedNumberOfInputs": [
    {
      "num_inputs": 1
    }
  ],
  "BinaryBoolean": [
    {
      "operator": "OR",
      "restriction_a": {
        "FixedInputMetadataValue": {
          "index": 0,
          "metadata_key": "status",
          "metadata_value": "submitted"
        }
      },
      "restriction_b": {
        "FixedInputMetadataValue": {
          "index": 0,
          "metadata_key": "status",
          "metadata_value": "amended"
        }
      }
    }
  ],
  "FixedInputMetadataValue": [
    {
      "index": 0,
      "metadata_key": "type",
      "metadata_value": "ORDER"
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
      "metadata_value": "accepted"
    }
  ]
}
```
