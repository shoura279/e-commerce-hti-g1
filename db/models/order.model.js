import { model, Schema } from "mongoose";
import { orderStatus, paymentMethods } from "../../src/utils/constant/enums.js";

// schema
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        finalPrice: Number,
        itemPrice: Number,
        quantity: Number,
      },
    ],
    address: { type: String, required: true },
    phone: { type: String, required: true },
    coupon: {
      couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
      code: String,
      discount: Number,
    },
    status: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.PLACED,
    },
    orderPrice: Number,
    finalPrice: Number,
    paymentMethod: {
      type: String,
      enum: Object.values(paymentMethods),
      default: paymentMethods.CASH,
    },
  },
  { timestamps: true }
);
// model
export const Order = model("Order", orderSchema);
