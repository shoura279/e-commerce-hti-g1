import { globalErrorHandling } from "./middleware/asyncHandler.js";
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

export const bootStrap = (app, express) => {
  // parse req
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
