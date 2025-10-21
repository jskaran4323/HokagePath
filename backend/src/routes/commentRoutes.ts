import express from 'express';
import {
  createComment,
  getPostComments,
  getCommentReplies,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment
} from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/post/:postId', createComment);
router.get('/post/:postId', getPostComments);
router.get('/:commentId/replies', getCommentReplies);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);
router.post('/:commentId/like', likeComment);
router.delete('/:commentId/like', unlikeComment);

export default router;