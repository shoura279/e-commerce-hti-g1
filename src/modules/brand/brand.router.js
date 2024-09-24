import { Router } from "express";
import { cloudUploads } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { addBrandVal, updateBrandVal } from "./brand.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addBrand, updateBrand } from "./brand.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const brandRouter = Router()
// add brand 
brandRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUploads().single('logo'),
    isValid(addBrandVal),
    asyncHandler(addBrand)
)

// update brand 
brandRouter.put('/:brandId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUploads({}).single('logo'),
    isValid(updateBrandVal),
    asyncHandler(updateBrand)
)
export default brandRouter