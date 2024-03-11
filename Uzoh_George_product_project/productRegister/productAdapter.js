"use strict";

function adapt(item) {
  return Object.assign(item, {
    productId: +item.productId,
    model: +item.model,
    price: +item.price,
    amount: +item.amount,
  });
}

module.exports = { adapt };
