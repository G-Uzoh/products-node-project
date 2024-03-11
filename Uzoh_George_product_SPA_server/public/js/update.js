"use strict";

(function () {
  let idField;
  let nameField;
  let modelField;
  let priceField;
  let amountField;

  let resultarea;

  let searchState = true;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    idField = document.getElementById("id");
    nameField = document.getElementById("name");
    modelField = document.getElementById("model");
    priceField = document.getElementById("price");
    amountField = document.getElementById("amount");

    resultarea = document.getElementById("resultarea");

    updateFieldsAccess();

    document.getElementById("submit").addEventListener("click", send);

    document.getElementById("clear").addEventListener("click", reset);

    idField.addEventListener("focus", clearAll);
  }

  function reset() {
    searchState = true;
    clearAll();
  }

  function clearAll() {
    if (searchState) {
      idField.value = "";
      nameField.value = "";
      modelField.value = "";
      priceField.value = "";
      amountField.value = "";
      resultarea.textContent = "";

      resultarea.removeAttribute("class");

      updateFieldsAccess();
    }
  }

  function updateFieldsAccess() {
    if (searchState) {
      idField.removeAttribute("readonly");
      nameField.setAttribute("readonly", true);
      modelField.setAttribute("readonly", true);
      priceField.setAttribute("readonly", true);
      amountField.setAttribute("readonly", true);
    } else {
      idField.setAttribute("readonly", true);
      nameField.removeAttribute("readonly");
      modelField.removeAttribute("readonly");
      priceField.removeAttribute("readonly");
      amountField.removeAttribute("readonly");
    }
  }

  async function send() {
    const baseURL = "http://localhost:4000/rest/products";
    try {
      if (searchState) {
        //get data
        const data = await fetch(`${baseURL}/productId/${idField.value}`, {
          mode: "cors",
        });
        const result = await data.json();
        console.log(result);

        if (result.length > 0) {
          const product = result[0];

          idField.value = product.productId;
          nameField.value = product.name;
          modelField.value = product.model;
          priceField.value = product.price;
          amountField.value = product.amount;

          searchState = false;

          updateFieldsAccess();
        } else {
          updateStatus({ message: "Nothing found", type: "error" });
        }
      } else {
        //update data
        const product = {
          productId: +idField.value,
          name: nameField.value,
          model: +modelField.value,
          price: +priceField.value,
          amount: +amountField.value,
        };
        const options = {
          method: "PUT",
          mode: "cors",
          body: JSON.stringify(product),
          headers: { "Content-Type": "application/json" },
        };

        const data = await fetch(`${baseURL}/${product.productId}`, options);
        const result = await data.json();

        updateStatus(result);
        searchState = true;
        updateFieldsAccess();
      }
    } catch (error) {
      updateStatus({ message: error.message, type: "error" });
    }
  }

  function updateStatus(status) {
    resultarea.textContent = status.message;
    resultarea.setAttribute("class", status.type);
  }
})();
