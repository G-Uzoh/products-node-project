"use strict";

const path = require("path");
const { readStorage, writeStorage } = require("./readerWriter");

function createStorageLayer(storageFolder, storageConfigFile) {
  const storageConfig = path.join(storageFolder, storageConfigFile);

  const {
    storageFile,
    adapterFile,
    primaryKey,
    resource,
  } = require(storageConfig);

  const { adapt } = require(path.join(storageFolder, adapterFile));

  const storageFilePath = path.join(storageFolder, storageFile);

  //   console.log("storageConfig: ", storageConfig);
  //   console.log("storageFilePath: ", storageFilePath);
  //   console.log("adapterPath: ", path.join(storageFolder, adapterFile));

  async function getAllFromStorage() {
    return await readStorage(storageFilePath);
  }

  async function getFromStorage(value, key = primaryKey) {
    return (await readStorage(storageFilePath)).filter(
      (item) => item[key] == value
    );
  }

  async function addToStorage(newObject) {
    const storage = await readStorage(storageFilePath);
    storage.push(adapt(newObject));
    return await writeStorage(storageFilePath, storage);
  }

  async function updateStorage(modifiedObject) {
    const storage = await readStorage(storageFilePath);
    const oldObject = storage.find(
      (item) => item[primaryKey] == modifiedObject[primaryKey]
    );

    if (oldObject) {
      Object.assign(oldObject, adapt(modifiedObject));
      return await writeStorage(storageFilePath, storage);
    }
    return false;
  }

  async function removeFromStorage(value) {
    const storage = await readStorage(storageFilePath);
    const index = storage.findIndex((item) => item[primaryKey] == value);

    if (index < 1) return false;

    storage.splice(index, 1);
    return await writeStorage(storageFilePath, storage);
  }

  async function getKeys() {
    const storage = await readStorage(storageFilePath);
    const keys = new Set(storage.flatMap((item) => Object.keys(item)));
    return [...keys];
  }

  async function getNextFreeKey() {
    const storage = await readStorage(storageFilePath);
    return Math.max(...storage.map((item) => item.id), 0) + 1;
  }

  return {
    getAllFromStorage,
    getFromStorage,
    addToStorage,
    updateStorage,
    removeFromStorage,
    getKeys,
    getNextFreeKey,
    primaryKey,
    resource,
  };
}

// createStorageLayer("../productRegister", "storageConfig.json");
module.exports = { createStorageLayer };
