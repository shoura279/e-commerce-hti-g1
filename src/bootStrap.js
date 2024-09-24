import Stripe from "stripe";
import {
  asyncHandler,
  globalErrorHandling,
} from "./middleware/asyncHandler.js";
import {
  authRouter,
  brandRouter,
  cartRouter,
  categoryRouter,
  couponRouter,
  orderRouter,
  productRouter,
  reviewRouter,
  subcategoryRouter,
  wishlistRouter,
} from "./modules/index.js";
import { Cart, Order, Product } from "../db/index.js";

export const bootStrap = (app, express) => {
  // parse req
  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    asyncHandler(async (req, res) => {
      const sig = req.headers["stripe-signature"].toString();
      const stripe = new Stripe(process.env.STRIPE_KEY);
      let event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        "whsec_uVhjr2pkYnjpXDEH6FHA9xGV5dBe95Km"
      );

      if (event.type == "checkout.session.completed") {
        const checkout = event.data.object;
        const orderId = checkout.metadata.orderId;
        const cartId = checkout.metadata.cartId;
        // clear cart
        await Cart.findByIdAndUpdate(cartId, { products: [] });
        // update order status
        const order = await Order.findByIdAndUpdate(orderId, {
          status: "placed",
        });
        let products = order.products;
        console.log({ products });

        for (const product of products) {
          const result = await Product.findByIdAndUpdate(product.productId, {
            $inc: { stock: -product.quantity },
          });
          console.log({ result });
        }
      }

      // Return a 200 res to acknowledge receipt of the event
      res.json({ message: "web hook completed from shoura" });
    })
  );
  app.use(express.json());
  // public folder
  app.use("/uploads", express.static("uploads"));
  // routeing
  app.use("/category", categoryRouter);
  app.use("/subcategory", subcategoryRouter);
  app.use("/brand", brandRouter);
  app.use("/product", productRouter);
  app.use("/auth", authRouter);
  app.use("/review", reviewRouter);
  app.use("/coupon", couponRouter);
  app.use("/wishlist", wishlistRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  // global Error handling
  app.use(globalErrorHandling);
};
