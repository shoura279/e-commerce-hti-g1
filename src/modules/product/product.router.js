import { Router } from "express";
import { cloudUploads } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { addProductVal } from "./product.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addProduct, getAllProducts } from "./product.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const productRouter = Router()
// add product 
productRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUploads({}).fields([{ name: 'mainImage', maxCount: 1 }, { name: "subImages", maxCount: 10 }]),
    isValid(addProductVal),
    asyncHandler(addProduct)
)

productRouter.get('/', asyncHandler(getAllProducts))
export default productRouter