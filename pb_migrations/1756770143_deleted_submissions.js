/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\"",
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
        "cascadeDelete": true,
        "collectionId": "pbc_3142635823",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 1,
        "minSelect": 1,
        "name": "user",
        "presentable": true,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_93315167",
        "hidden": false,
        "id": "relation2752707218",
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
        "id": "number848901969",
        "max": 100,
        "min": 0,
        "name": "score",
        "onlyInt": false,
        "presentable": true,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
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
      },
      {
        "hidden": false,
        "id": "date222754019",
        "max": "",
        "min": "",
        "name": "started_at",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "date1410257210",
        "max": "",
        "min": "",
        "name": "completed_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
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
          "started",
          "in_progress",
          "completed",
          "abandoned",
          "timeout",
          "submitted",
          "graded",
          "reviewed"
        ]
      },
      {
        "hidden": false,
        "id": "number2995025325",
        "max": 10,
        "min": 1,
        "name": "attempt_number",
        "onlyInt": false,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "select517487686",
        "maxSelect": 1,
        "name": "submission_type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "normal",
          "practice",
          "timed",
          "exam",
          "review"
        ]
      },
      {
        "hidden": false,
        "id": "json1073059852",
        "maxSize": 0,
        "name": "submission_data",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "json"
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
      }
    ],
    "id": "pbc_3482339971",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "submissions",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
})
