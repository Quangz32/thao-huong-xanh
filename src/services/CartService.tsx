"use client";

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
  console.log("exiting item", JSON.stringify(existingItem));
  if (!existingItem) {
    newCart.push({
      productId: productId,
      quantity: quantity,
    });
  }

  console.log("newCart", newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
};

export const getCart = (): any[] | null => {
  const cartData = localStorage.getItem("cart");
  if (!cartData) return null;
  try {
    return JSON.parse(cartData);
  } catch {
    return null;
  }
};

export const deleteCartItem = (productId: string) => {
  const cart = getCart();
  if (!cart) return;
  const filteredCart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(filteredCart));
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
