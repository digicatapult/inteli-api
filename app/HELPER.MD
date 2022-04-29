 Some curl commands so no need to type and good for examples

```sh
# post recipes
curl -i -X POST localhost:3000/v1/recipe -d '{}' -H 'content-type: application/json'

# post recipe transaction
curl -i -X POST localhost:3000/v1/reci/1/creation -d '{}' -H 'content-type: application/json'
```