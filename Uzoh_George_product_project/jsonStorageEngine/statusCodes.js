"use strict";

const CODES = {
  PROGRAM_ERROR: 0,
  NOT_FOUND: 1,
  INSERT_OK: 2,
  NOT_INSERTED: 3,
  ALREADY_IN_USE: 4,
  REMOVE_OK: 5,
  NOT_REMOVED: 6,
  UPDATE_OK: 7,
  NOT_UPDATED: 8,
  KEY_DO_NOT_MATCH: 9,
};

const TYPES = {
  ERROR: "error",
  INFO: "info",
};

const MESSAGES = {
  PROGRAM_ERROR: () => ({
    message: "Sorry! error in the program",
    code: CODES.PROGRAM_ERROR,
    type: TYPES.ERROR,
  }),
  NOT_FOUND: (key, value) => ({
    message: `No resource found with ${key} ${value}`,
    code: CODES.NOT_FOUND,
    type: TYPES.INFO,
  }),
  INSERT_OK: (key, value) => ({
    message: `Resource with ${key} ${value} was inserted`,
    code: CODES.INSERT_OK,
    type: TYPES.INFO,
  }),
  NOT_INSERTED: () => ({
    message: "Resource was not inserted",
    code: CODES.NOT_INSERTED,
    type: TYPES.ERROR,
  }),
  ALREADY_IN_USE: (value) => ({
    message: `Key ${value} was already in use`,
    code: CODES.ALREADY_IN_USE,
    type: TYPES.ERROR,
  }),
  REMOVE_OK: (key, value) => ({
    message: `Resource with ${key} ${value} was removed`,
    code: CODES.REMOVE_OK,
    type: TYPES.INFO,
  }),
  NOT_REMOVED: (key, value) => ({
    message: `No resource removed with ${key} ${value}`,
    code: CODES.NOT_REMOVED,
    type: TYPES.ERROR,
  }),
  UPDATE_OK: (key, value) => ({
    message: `Resource with ${key} ${value} was updated`,
    code: CODES.UPDATE_OK,
    type: TYPES.INFO,
  }),
  NOT_UPDATED: () => ({
    message: "Resource was not updated",
    code: CODES.NOT_UPDATED,
    type: TYPES.ERROR,
  }),
  KEY_DO_NOT_MATCH: (key, keyInResource) => ({
    message: `The given key ${key} doesn't match the given key ${keyInResource} in the resource object`,
    code: CODES.KEY_DO_NOT_MATCH,
    type: TYPES.ERROR,
  }),
};

module.exports = { CODES, TYPES, MESSAGES };
