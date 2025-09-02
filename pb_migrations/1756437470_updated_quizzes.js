/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_93315167")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select939794505",
    "maxSelect": 1,
    "name": "repeat_type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "Once",
      "Daily",
      "Weekly",
      "Monthly",
      "none"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_93315167")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select939794505",
    "maxSelect": 1,
    "name": "repeat_type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "Once",
      "Daily",
      "Weekly",
      "Monthly"
    ]
  }))

  return app.save(collection)
})
