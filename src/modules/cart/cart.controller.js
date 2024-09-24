import { Cart, Product } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

export const addToCart = async (req, res, next) => {
    // get data from req
    const { productId, quantity } = req.body;
    // check product
    const productExist = await Product.findById(productId)// {} , null
    // console.log(productExist);

    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    if (!productExist.inStock(quantity)) {
        return next(new AppError('out of stock', 400))
    }
    let data = ''
    const ProductExistInCart = await Cart.findOneAndUpdate(
        { user: req.authUser._id, "products.productId": productId },
        { 'products.$.quantity': quantity },
        { new: true }
    )// {} , null
    console.log(ProductExistInCart);

    data = ProductExistInCart
    /**
     * 1 find cart
     * 2 product [] find product if exist
     * 3 update cart
     * 4 add to cart
     */
    if (!ProductExistInCart) {
        const addedProduct = await Cart.findOneAndUpdate({ user: req.authUser._id }, {
            $push: { products: { productId, quantity } }
        }, { new: true })
        data = addedProduct
    }
    // send response
    return res.status(200).json({ message: "added to cart successfully", success: true, data })
}