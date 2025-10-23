import express from 'express';
import {
  uploadProfilePicture as uploadProfilePictureController,
  uploadPostImages as uploadPostImagesController,
  deleteImage
} from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import {
  uploadProfilePicture as uploadProfilePictureMiddleware,
  uploadPostImages as uploadPostImagesMiddleware
} from '../middleware/upload';

const router = express.Router();

router.use(authenticate);

// Upload profile picture
router.post(
  '/profile-picture',
  uploadProfilePictureMiddleware,
  uploadProfilePictureController
);

// Upload post images
router.post(
  '/post-images',
  uploadPostImagesMiddleware,
  uploadPostImagesController
);

// Delete image
router.delete('/image', deleteImage);

export default router;
