"use strict";

(function () {
  let keylist;
  let resultarea;
  let searchvalue;

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    keylist = document.getElementById("keylist");
    resultarea = document.getElementById("resultarea");
    searchvalue = document.getElementById("searchvalue");

    try {
      const data = await fetch("http://localhost:4000/rest/products/keys", {
        mode: "cors",
      });
      if (data.ok) {
        const keys = await data.json();
        if (keys.length > 0) {
          populateList(keys);
        } else {
          showErrorMessage("search not available");
        }
      } else {
        showErrorMessage("failed communication!");
      }
    } catch (err) {
      showErrorMessage(err.message);
    }
  }

  function populateList(keynames) {
    for (const field of keynames) {
      const option = document.createElement("option");
      option.value = field;
      option.textContent = field;

      keylist.appendChild(option);
    }

    keylist.value = keynames[0];

    document.getElementById("submit").addEventListener("click", send);
  }

  async function send() {
    const keyName = keylist.value;
    const value = searchvalue.value;

    try {
      const data = await fetch(
        `http://localhost:4000/rest/products/${keyName}/${value}`,
        { mode: "cors" }
      );

      const result = await data.json();

      updatePage(result);
    } catch (err) {
      showErrorMessage(err.message);
    }
  }

  function updatePage(data) {
    if (!data) {
      showErrorMessage("Programming error!");
    } else if (data.length === 0) {
      showErrorMessage("Nothing found");
    } else {
      const htmlString = data.map((item) => createProduct(item)).join(" ");
      resultarea.innerHTML = htmlString;
    }
  }

  function createProduct(product) {
    return `<div class="product">
        <p>id: ${product.productId}</p>
        <p>Name: ${product.name}</p>
        <p>Model: ${product.model}</p>
        <p>Price: ${product.price}</p>
        <p>Amount: ${product.amount}</p>
    </div>`;
  }

  function showErrorMessage(message) {
    resultarea.innerHTML = `<p>${message}</p>`;
  }
})();
