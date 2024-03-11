"use strict";

(function () {
  let idField, nameField, modelField, priceField, amountField, resultarea;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    idField = document.getElementById("id");
    nameField = document.getElementById("name");
    modelField = document.getElementById("model");
    priceField = document.getElementById("price");
    amountField = document.getElementById("amount");
    resultarea = document.getElementById("resultarea");

    document.getElementById("submit").addEventListener("click", send);

    idField.addEventListener("focus", clear);
  }

  function clear() {
    idField.value = "";
    nameField.value = "";
    modelField.value = "";
    priceField.value = "";
    amountField.value = "";
    resultarea.textContent = "";
    resultarea.removeAttribute("class");
  }

  async function send() {
    const product = {
      productId: +idField.value,
      name: nameField.value,
      model: +modelField.value,
      price: +priceField.value,
      amount: +amountField.value,
    };

    console.log(product);

    try {
      const options = {
        method: "POST",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      };

      const data = await fetch("http://localhost:4000/rest/products", options);
      const result = await data.json();

      console.log(result);

      updateStatus(result);
    } catch (error) {
      console.log(error);
      updateStatus({ message: error.message, type: "error" });
    }
  }

  function updateStatus(status) {
    resultarea.textContent = status.message;
    resultarea.setAttribute("class", status.type);
  }
})();
