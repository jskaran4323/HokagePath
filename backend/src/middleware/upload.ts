import multer from "multer";
import multerS3 from "multer-s3";

import {s3, BUCKET_NAME} from '../config/aws';

import { Request } from 'express';

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) =>{
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
    if(allowedMimes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Invalid file type, Only JPEG, PNG, GIF and WebP is allowed'), false)

    }
};
export const uploadToS3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `uploads/${file.fieldname}-${uniqueSuffix}.${extension}`);
      }
    }),
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
  });


export const uploadProfilePicture = uploadToS3.single('profilePicture');

export const uploadPostImages = uploadToS3.array('images', 5);