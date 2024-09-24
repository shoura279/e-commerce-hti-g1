import { deleteCloudImage } from "../utils/cloud.js"
import { deleteFile } from "../utils/file.js"

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            next(err)
        })
    }
}
export const globalErrorHandling = async (err, req, res, next) => {
    // rollback file system
    if (req.file) {
        deleteFile(req.file.path)
    }
    // rollback cloud 
    if (req.failImage) {
        await deleteCloudImage(req.failImage.public_id)
    }
    if (req.failImages?.length > 0) {
        for (const public_id of req.failImages) {
            await deleteCloudImage(public_id)
        }
    }
    return res.status(err.statusCode || 500).json({ message: err.message, success: false })
}