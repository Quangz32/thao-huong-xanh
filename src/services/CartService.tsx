"use client";
import products from "@/data/Product";
export const addToCart = (productId: string, quantity: number) => {
  const cart = getCart();
  if (cart == null) {
    console.log("cart is null");
    localStorage.setItem("cart", JSON.stringify([{ productId: productId, quantity: quantity }]));
    return;
  }

  //   const newCart = [];

  const newCart = cart.map((item) => {
    if (item.productId === productId) {
      return {
        productId: productId,
        quantity: item.quantity + quantity,
      };
    } else {
      return item;
    }
  });

  const existingItem = newCart.find((item) => item.productId === productId);
  if (existingItem !== null) {
    newCart.push({
      productId: productId,
      quantity: quantity,
    });
  }

  console.log("newCart", newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
};

export const getCart = (): [any] => {
  return JSON.parse(localStorage.getItem("cart") as string);
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
