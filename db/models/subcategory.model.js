import { model, Schema } from "mongoose";

// schema
const subcategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    image: Object,
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })
// model
export const Subcategory = model('Subcategory', subcategorySchema)