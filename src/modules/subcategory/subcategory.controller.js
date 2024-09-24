import slugify from "slugify"
import { Category, Subcategory } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

// addSubcategory
export const addSubcategory = async (req, res, next) => {
    // get data from req
    let { name, category } = req.body
    name = name.toLowerCase()
    // check existence
    const subcategoryExist = await Subcategory.findOne({ name })// {},null
    if (subcategoryExist) {
        return next(new AppError(messages.subcategory.alreadyExist, 409))
    }
    // check category exist
    const categoryExist = await Category.findById(category)// {},null
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // prepare data
    if (!req.file) {
        return next(new AppError('image is required', 400))
    }
    const slug = slugify(name)
    const subcategory = new Subcategory({
        name,
        slug,
        image: { path: req.file?.path },
        category
    })

    // add to db
    const createdSubcategory = await subcategory.save()
    if (!createdSubcategory) {
        return next(new AppError(messages.subcategory.failToCreate, 500))
    }
    // send response
    return res.status(201).json({
        message: messages.subcategory.createSuccessfully,
        success: true,
        data: createdSubcategory
    })
}

//getSubcategories
export const getSubcategories = async (req, res, next) => {
    // get data from req
    const { categoryId } = req.params
    const subcategories = await Subcategory.find({ category: categoryId }).populate([{ path: "category" }])// [{}],[]
    // if(subcategories.length==0)
    return res.status(200).json({ success: true, data: subcategories })
}