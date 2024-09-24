import fs from 'fs'
import path from 'path'
import multer, { diskStorage } from "multer"
import { nanoid } from 'nanoid'
import { AppError } from './appError.js'
export const fileValidation = {
    image: ['image/png', 'image/jpeg'],
    file: ['application/pdf', 'application/msword']
}
export const fileUploads = ({ folder, allowTypes = fileValidation.image }) => {
    const storage = diskStorage({
        destination: (req, file, cb) => {
            const fullPath = path.resolve(`uploads/${folder}`)// c/users/node/c42/app5/
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true })
            }
            cb(null, `uploads/${folder}`)
        },
        filename: (req, file, cb) => {
            cb(null, nanoid() + "-" + file.originalname)
        }
    })
    const fileFilter = (req, file, cb) => {
        if (!allowTypes.includes(file.mimetype)) {
            cb(new AppError('invalid file format', 400), false)
        }
        cb(null, true)
    }
    return multer({ storage, fileFilter })
}