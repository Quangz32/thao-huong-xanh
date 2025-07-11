"use client";

export interface CartItem {
  productId: string;
  isCombo: boolean;
  productIds: string[]; // for combo
  quantity: number;
}

export const addToCart = (cartItem: CartItem) => {
  const cart = getCart();
  if (cart == null) {
    console.log("cart is null");
    localStorage.setItem("cart", JSON.stringify([cartItem]));
    return;
  }

  //   const newCart = [];

  let productAdded = false;
  const newCart = cart.map((item) => {
    //Nếu là sản phẩm đơn lẻ và đã có trong giỏ hàng thì cộng số lượng
    if (!cartItem.isCombo && item.productId === cartItem.productId) {
      productAdded = true;
      return {
        ...cartItem,
        quantity: item.quantity + cartItem.quantity,
      };
    }

    //Nếu là combo và đã có trong giỏ hàng thì cộng số lượng
    // if (cartItem.isCombo && item.productIds.includes(cartItem.productIds)) {
    //   return {
    //     ...cartItem,
    //     quantity: item.quantity + cartItem.quantity,
    //   };
    // }

    return item;
  });

  if (!productAdded) {
    newCart.push(cartItem);
  }

  console.log("newCart", newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));

  // Dispatch custom event để thông báo cart đã thay đổi
  window.dispatchEvent(new Event("cartUpdated"));
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

// Hàm đếm tổng số lượng sản phẩm trong giỏ hàng
export const getCartItemCount = (): number => {
  const cart = getCart();
  if (!cart) return 0;
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const deleteCartItem = (deleteIndex: number) => {
  const cart = getCart();
  if (!cart) return;
  const filteredCart = cart.filter((item, index) => index !== deleteIndex);
  console.log("filteredCart", filteredCart);
  localStorage.setItem("cart", JSON.stringify(filteredCart));

  // Dispatch custom event để thông báo cart đã thay đổi
  window.dispatchEvent(new Event("cartUpdated"));
};

export const clearCart = () => {
  localStorage.removeItem("cart");

  // Dispatch custom event để thông báo cart đã thay đổi
  window.dispatchEvent(new Event("cartUpdated"));
};
