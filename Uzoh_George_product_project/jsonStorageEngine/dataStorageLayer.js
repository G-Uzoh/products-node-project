"use strict";

const { CODES, TYPES, MESSAGES } = require("./statusCodes");
const { createStorageLayer } = require("./storageLayer");

function createDataStorage(storagePath, storageConfig) {
  const {
    getAllFromStorage,
    getFromStorage,
    addToStorage,
    updateStorage,
    removeFromStorage,
    getKeys,
    getNextFreeKey,
    primaryKey,
    resource,
  } = createStorageLayer(storagePath, storageConfig);

  class DataStorage {
    get CODES() {
      return CODES;
    }

    get TYPES() {
      return TYPES;
    }

    get PRIMARY_KEY() {
      return primaryKey;
    }

    get KEYS() {
      return getKeys();
    }

    get NEXT_FREE_KEY() {
      return getNextFreeKey();
    }

    get MESSAGES() {
      return MESSAGES;
    }

    get RESOURCE() {
      return resource;
    }

    getAll() {
      return getAllFromStorage();
    }

    get(value, key = primaryKey) {
      return getFromStorage(value, key);
    }

    insert(item) {
      return new Promise(async (resolve, reject) => {
        if (item) {
          if (!item[primaryKey]) {
            reject(MESSAGES.NOT_INSERTED());
          } else if ((await getFromStorage(item[primaryKey])).length > 0) {
            reject(MESSAGES.ALREADY_IN_USE(item[primaryKey]));
          } else if (await addToStorage(item)) {
            resolve(MESSAGES.INSERT_OK(primaryKey, item[primaryKey]));
          } else {
            reject(MESSAGES.NOT_INSERTED());
          }
        } else {
          reject(MESSAGES.NOT_INSERTED());
        }
      });
    }

    update(item) {
      return new Promise(async (resolve, reject) => {
        if (item) {
          if (await updateStorage(item)) {
            resolve(MESSAGES.UPDATE_OK(primaryKey, item[primaryKey]));
          } else {
            reject(MESSAGES.NOT_UPDATED());
          }
        } else {
          reject(MESSAGES.NOT_UPDATED());
        }
      });
    }

    remove(value) {
      return new Promise(async (resolve, reject) => {
        if (!value) {
          reject(MESSAGES.NOT_FOUND(primaryKey, "--empty--"));
        } else if (await removeFromStorage(value)) {
          resolve(MESSAGES.REMOVE_OK(primaryKey, value));
        } else {
          reject(MESSAGES.NOT_REMOVED(primaryKey, value));
        }
      });
    }
  }

  return new DataStorage();
}

module.exports = { createDataStorage };
