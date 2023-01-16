import { diskStorage } from "multer";
import * as path from 'path'
import * as fs from 'fs'
const { nanoid } = require("nanoid");

export const storage = {
  dest: './assets/products/',
  limits: {
    fileSize: 209715200,
    files: 1000
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      const dir = `./assets/products/`

      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        throw new Error('Only image files are allowed!');
      }

      fs.exists(dir, exist => {
        if (!exist) {
          return fs.mkdir(dir, error => cb(error, dir))
        }
        return cb(null, dir)
      })
    },
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + nanoid(6);
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`)
    }
  })
}