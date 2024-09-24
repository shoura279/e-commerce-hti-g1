import { Router } from "express"
import { fileUploads } from "../../utils/multer.js"
import { isValid } from "../../middleware/validation.js"
import { asyncHandler } from "../../middleware/asyncHandler.js"
import { addSubcategory, getSubcategories } from "./subcategory.controller.js"
import { addSubcategoryVal, getSubcategoriesVal } from "./subcategory.validation.js"
import { isAuthenticated } from "../../middleware/authentication.js"
import { isAuthorized } from "../../middleware/authorization.js"
import { roles } from "../../utils/constant/enums.js"

const subcategoryRouter = Router()

// add subcategory 
subcategoryRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUploads({ folder: "subcategory" }).single('image'),
    isValid(addSubcategoryVal),
    asyncHandler(addSubcategory)
)

subcategoryRouter.get('/:categoryId',
    isValid(getSubcategoriesVal),
    asyncHandler(getSubcategories)
)
export default subcategoryRouter