 Some curl commands so no need to type and good for examples

```sh
# post recipes
curl -i -X POST localhost:3000/v1/recipe -d '{}' -H 'content-type: application/json'

# post recipe transaction
curl -i -X POST localhost:3000/v1/recipe/1/creation -d '{ "inputs": [], "outputs": [{"roles":{"Owner":"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"},"metadata":{"tokenId":{"type":"TOKEN_ID", "value": 10 }}}]}' -H 'content-type: application/json'
```