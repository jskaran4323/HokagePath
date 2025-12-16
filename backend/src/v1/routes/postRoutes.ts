import express from 'express';
import {
  createPost,
  getPost,
  getFeed,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost
} from '../../v1/controllers/postController';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createPost);
router.get('/feed', getFeed);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.delete('/:id/like', unlikePost);

export default router;
