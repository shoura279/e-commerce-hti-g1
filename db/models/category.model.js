import { model, Schema } from "mongoose";

// schema
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,//Electronics >>> electronics
        trim: true, // "Electronics"
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,//Electronics >>> electronics
        trim: true, // "Electronics"
    },
    image: Object,// {url,id} {path}
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:  true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

categorySchema.virtual('subcategories', {
    ref: "Subcategory",
    localField: "_id",
    foreignField: "category"
})
// model
export const Category = model('Category', categorySchema)