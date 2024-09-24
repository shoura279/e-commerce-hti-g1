import { Cart, Product } from "../../../../db/index.js";

export const clearCart = async (userId) => {
  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId },
    { products: [] }
  ); // {},null
  if (!updatedCart) {
    return { errMessage: "fail to update cart" };
  }
  return true;
};

export const updateProductQuantity = async (productId, quantity) => {
  // await Product.findByIdAndUpdate(productId, { stock: { $inc: -quantity } });
  await Product.findByIdAndUpdate(productId, {
    $inc: { stock: -quantity },
  });
};
