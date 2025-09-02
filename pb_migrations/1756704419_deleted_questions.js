/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4009210445");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "@request.auth.collectionName = \"users\" || @request.auth.role = \"admin\"",
    "deleteRule": "@request.auth.role = \"admin\"",
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
        "id": "text3069659470",
        "max": 1000,
        "min": 10,
        "name": "question",
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
        "presentable": false,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json3148230340",
        "maxSize": 0,
        "name": "correct_answers",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "select105650625",
        "maxSelect": 0,
        "name": "category",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "excel",
          "python",
          "pandas"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3169056664",
        "max": 100,
        "min": 1,
        "name": "sub_category",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select2599078931",
        "maxSelect": 0,
        "name": "level",
        "presentable": false,
        "required": true,
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
        "maxSelect": 0,
        "name": "question_type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "Single Choice",
          "Multiple Choice"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2284106510",
        "max": 500,
        "min": 0,
        "name": "explanation",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select2063623452",
        "maxSelect": 1,
        "name": "status",
        "presentable": true,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "draft",
          "active",
          "inactive",
          "archived",
          "pending_review",
          "approved",
          "rejected"
        ]
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
    "listRule": "@request.auth.id != \"\" && (status = \"active\" || status = \"approved\" || @request.auth.role = \"admin\")",
    "name": "questions",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.collectionName = \"users\" || @request.auth.role = \"admin\"",
    "viewRule": "@request.auth.id != \"\" && (status = \"active\" || status = \"approved\" || @request.auth.role = \"admin\")"
  });

  return app.save(collection);
})
