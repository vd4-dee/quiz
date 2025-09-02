/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_93315167")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number3857578251",
    "max": 180,
    "min": 1,
    "name": "duration_minutes",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_93315167")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number3857578251",
    "max": 180,
    "min": 5,
    "name": "duration_minutes",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
