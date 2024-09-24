import fs from 'fs'
import path from 'path'
export const deleteFile = (filepath) => {
    const fullPath = path.resolve(filepath)
    fs.unlinkSync(fullPath)
}