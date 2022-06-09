# Order

Token formats and restrictions for the `Order` type

## POST /order/{id}/submission

A buyer submits an order consisting of 1-10 recipes from a supplier

### Request body

#### Inputs

`[]`

#### Outputs

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
  "FixedNumberOfInputs": [
    {
      "num_inputs": 0
    }
  ],
  "FixedNumberOfOutputs": [
    {
      "num_outputs": 1
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
    },
    {
      "index": 0,
      "metadata_key": "recipe0",
      "metadata_value_type": "TokenId"
    }
  ]
}
```

## POST /order/{id}/rejection

A supplier rejects an order along with amendment suggestions

### Request body

#### Inputs

`[POST /order/{id}/submission]`

#### Outputs

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
