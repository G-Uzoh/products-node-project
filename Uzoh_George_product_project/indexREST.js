"use strict";

const path = require("path");
const cors = require("cors");
const express = require("express");

const app = express();

const { port, host, storageEngine, storage } = require("./config.json");

const storageEnginePath = path.join(__dirname, storageEngine.folder);

const dataStoragePath = path.join(
  storageEnginePath,
  storageEngine.dataStorageFile
);

const storagePath = path.join(__dirname, storage.folder);

const { createDataStorage } = require(dataStoragePath);

const dataStorage = createDataStorage(storagePath, storage.storageConfigFile);

// dataStorage.getAll().then(console.log);

const RESOURCE = dataStorage.RESOURCE;

app.use(cors());
app.use(express.json());

app.get("/rest", (req, res) => res.json(RESOURCE));

app.get(`/rest/${RESOURCE}/keys`, (req, res) =>
  dataStorage.KEYS.then((result) => res.json(result))
);

app.get(`/rest/${RESOURCE}`, (req, res) =>
  dataStorage.getAll().then((result) => res.json(result))
);

app.get(`/rest/${RESOURCE}/:value`, (req, res) =>
  dataStorage.get(req.params.value).then((result) => res.json(result))
);

app.get(`/rest/${RESOURCE}/:key/:value`, (req, res) =>
  dataStorage
    .get(req.params.value, req.params.key)
    .then((result) => res.json(result))
);

app.post(`/rest/${RESOURCE}`, (req, res) =>
  dataStorage
    .insert(req.body)
    .then((result) => res.json(result))
    .catch((err) => res.json(err))
);

app.delete(`/rest/${RESOURCE}/:value`, (req, res) =>
  dataStorage
    .remove(req.params.value)
    .then((result) => res.json(result))
    .catch((err) => res.json(err))
);

app.put(`/rest/${RESOURCE}/:value`, async (req, res) => {
  const resObj = req.body;
  const keyValue = req.params.value;

  if (keyValue != resObj[dataStorage.PRIMARY_KEY]) {
    res.json(
      dataStorage.MESSAGES.KEY_DO_NOT_MATCH(
        keyValue,
        resObj[dataStorage.PRIMARY_KEY]
      )
    );
  } else {
    const result = await dataStorage.get(keyValue);

    if (result.length > 0) {
      dataStorage
        .update(resObj)
        .then((result) => res.json(result))
        .catch((err) => res.json(err));
    } else {
      dataStorage
        .insert(resObj)
        .then((result) => res.json(result))
        .catch((err) => res.json(err));
    }
  }
});

app.all("*", (req, res) => res.json("not supported"));

app.listen(port, host, () => console.log(`${host}:${port} serving...`));
