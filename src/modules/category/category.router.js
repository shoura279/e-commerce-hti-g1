import { Router } from "express";
import { fileUploads } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { addCategoryVal } from "./category.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCategory, getCategories } from "./category.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const categoryRouter = Router()
// add category 
categoryRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUploads({ folder: "category", }).single('image'),
    isValid(addCategoryVal),
    asyncHandler(addCategory)
)
categoryRouter.get('/', asyncHandler(getCategories))
export default categoryRouter