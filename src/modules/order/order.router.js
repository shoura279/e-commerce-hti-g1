import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { createOrder } from "./order.controller.js";

const orderRouter = Router();
// create order
orderRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.USER]),
  asyncHandler(createOrder)
);
export default orderRouter;
