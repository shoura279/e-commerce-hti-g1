// import { Category } from "../../../db/models/category.model"

import slugify from "slugify";
import { Category } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add category
export const addCategory = async (req, res, next) => {
  // get data from req
  let { name } = req.body;
  name = name.toLowerCase();
  // check existence
  const categoryExist = await Category.findOne({ name }); // {}, null
  if (categoryExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  // prepare data
  const slug = slugify(name);
  const category = new Category({
    name,
    slug,
    image: { path: req.file.path },
    createdBy: req.authUser._id,
  });

  // add to db
  const createdCategory = await category.save();
  if (!createdCategory) {
    // rollback delete image
    return next(new AppError(messages.category.failToCreate, 500));
  }
  // send response
  return res.status(201).json({
    message: messages.category.createSuccessfully,
    success: true,
    data: createdCategory,
  });
};

//getCategories
export const getCategories = async (req, res, next) => {
  const categories = await Category.find({}).populate([
    {
      path: "subcategories",
      populate: [{ path: "category", populate: [{ path: "subcategories" }] }],
    },
  ]);
  // console.log(categories[0].subcategories);
  return res.status(200).json({ success: true, data: categories });
};
