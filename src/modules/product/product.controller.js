import slugify from "slugify"
import { Brand, Product, Subcategory } from "../../../db/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import cloudinary from "../../utils/cloud.js"
import { ApiFeature } from "../../utils/apiFeature.js"

// add product
export const addProduct = async (req, res, next) => {
    // get data from req
    const { name,
        description,
        stock,
        price,
        discount,
        discountType,
        colors,
        sizes,
        category,
        subcategory,
        brand } = req.body
    // check existence
    // 1- brand exist
    const brandExist = await Brand.findById(brand)// {},null
    if (!brandExist) {
        return next(new AppError(messages.brand.notFound, 404))
    }
    // 2- subcategory
    const subcategoryExist = await Subcategory.findById(subcategory)// {},null
    if (!subcategoryExist) {
        return next(new AppError(messages.subcategory.notFound, 404))
    }
    // upload images
    // req.files >>> {mainImage:[{}],subImages:[{},{},{},{},{}]}
    // console.log(req.files);

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: "hti-g1/products/main-image" })
    let mainImage = { secure_url, public_id }
    req.failImages = []
    req.failImages.push(public_id)
    let subImages = []
    // let subImages = req.files.subImages.map(async (file) => {

    //     const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: "hti-g1/products/sub-images" })
    //     // console.log({ secure_url, public_id });

    //     // subImages.push({ secure_url, public_id })
    //     // console.log(subImages);
    //     return { secure_url, public_id }

    // })
    // console.log(subImages);
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: "hti-g1/products/sub-images" })
        subImages.push({ secure_url, public_id })
        req.failImages.push(public_id)
    }
    // prepare data
    const slug = slugify(name)
    const product = new Product({
        name,
        slug,
        description,
        stock,
        price,
        discount,
        discountType,
        colors: JSON.parse(colors),
        sizes: JSON.parse(sizes),
        category,
        subcategory,
        brand,
        mainImage,
        subImages,
        createdBy: req.authUser._id,
        updatedBy: req.authUser._id
    })
    // add to db
    const createdProduct = await product.save()
    if (!createdProduct) {
        return next(new AppError(messages.product.failToCreate, 500))
    }
    console.log(createdProduct);

    // send response 
    return res.status(201).json({
        message: messages.product.createSuccessfully,
        success: true,
        data: createdProduct
    })
}

// get products
// pagination ✅ sort ✅ select ✅ filter
export const getAllProducts = async (req, res, next) => {
    // let { page, size, sort, select, ...filter } = req.query
    // // let filter = JSON.parse(JSON.stringify(req.query))
    // // console.log({ select });
    // // let excludedFields = ['sort', 'select', 'page', 'size']
    // // excludedFields.forEach(ele => {
    // //     delete filter[ele]
    // // })

    // console.log(filter);
    // filter = JSON.parse(JSON.stringify(filter).replace(/'gte|gt|lte|lt'/g, match => `$${match}`))
    // console.log(filter);

    // // filter.price = 10000
    // // filter["price"] = 2342
    // /**
    //  * page  size data   skip
    //  * 1     3    1 2 3  0
    //  * 2     3    4 5 6  3
    //  * 3     3    7 8 9  6
    //  */
    // if (!page || page <= 0) {
    //     page = 1
    // }
    // if (!size || size <= 0) {
    //     size = 3
    // }
    // let skip = (page - 1) * size;
    // sort = sort?.replaceAll(',', ' ')
    // select = select?.replaceAll(',', ' ')
    // // console.log({ sort });
    // // console.log(req.query);

    // const mongooseQuery = Product.find(filter)
    // mongooseQuery.limit(size).skip(skip)
    // mongooseQuery.sort(sort)
    // mongooseQuery.select(select)
    // const products = await mongooseQuery

    const apiFeature = new ApiFeature(Product.find(), req.query).pagination().sort().select().filter()
    const products = await apiFeature.mongooseQuery
    return res.status(200).json({ success: true, data: products })
}