/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4009210445")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionName = \"users\" || @request.auth.role = \"admin\"",
    "deleteRule": "@request.auth.role = \"admin\"",
    "listRule": "@request.auth.id != \"\" && (status = \"active\" || status = \"approved\" || @request.auth.role = \"admin\")",
    "updateRule": "@request.auth.collectionName = \"users\" || @request.auth.role = \"admin\"",
    "viewRule": "@request.auth.id != \"\" && (status = \"active\" || status = \"approved\" || @request.auth.role = \"admin\")"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4009210445")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
