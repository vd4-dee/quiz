/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_93315167",
        "hidden": false,
        "id": "_clone_CTcs",
        "maxSelect": 1,
        "minSelect": 1,
        "name": "quiz",
        "presentable": true,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "_clone_wpT1",
        "max": 100,
        "min": 0,
        "name": "score",
        "onlyInt": false,
        "presentable": true,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "pbc_3247921065",
    "indexes": [],
    "listRule": null,
    "name": "_bk_submissions",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "select id ,quiz, score from submissions WHERE score > 0",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3247921065");

  return app.delete(collection);
})
