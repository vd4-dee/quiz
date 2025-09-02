/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number906242243",
    "max": 1000,
    "min": 0,
    "name": "total_questions",
    "onlyInt": false,
    "presentable": true,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number906242243",
    "max": 1000,
    "min": 1,
    "name": "total_questions",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
