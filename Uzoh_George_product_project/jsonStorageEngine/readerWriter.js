"use strict";

const fs = require("fs").promises;

async function readStorage(storageFile) {
  try {
    const data = await fs.readFile(storageFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeStorage(storageFile, data) {
  try {
    await fs.writeFile(storageFile, JSON.stringify(data, null, 4), {
      encoding: "utf8",
      flag: "w",
    });
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { readStorage, writeStorage };

// writeStorage("./test.json", { name: "test" })
//   .then(console.log)
//   .catch(console.log);

// readStorage("../productRegister/Uzoh_George_products.json")
//   .then(console.log)
//   .catch(console.log);
