import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
export const addSubcategoryVal = joi.object({
    name: generalFields.name.required(),
    category: generalFields.objectId.required()
})

export const getSubcategoriesVal = joi.object({
    categoryId: generalFields.objectId.required()
})