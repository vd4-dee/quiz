/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2329695445",
        "max": 0,
        "min": 1,
        "name": "questions",
        "pattern": "",
        "presentable": true,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json1355859462",
        "maxSize": 0,
        "name": "answers",
        "presentable": true,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json3148230340",
        "maxSize": 0,
        "name": "correct_answers",
        "presentable": true,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "select105650625",
        "maxSelect": 1,
        "name": "category",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "excel",
          "python"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3169056664",
        "max": 0,
        "min": 0,
        "name": "sub_category",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select2599078931",
        "maxSelect": 1,
        "name": "level",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "easy",
          "normal",
          "hard",
          "very hard"
        ]
      },
      {
        "hidden": false,
        "id": "select3526408902",
        "maxSelect": 1,
        "name": "question_type",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "Yes/No",
          "Single Choice"
        ]
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "editor2284106510",
        "maxSize": 0,
        "name": "explanation",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "editor"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_4009210445",
    "indexes": [],
    "listRule": null,
    "name": "questions",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4009210445");

  return app.delete(collection);
})
