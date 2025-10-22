import express from 'express';
import {
  updateProfile,
  changePassword,
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.get('/search', searchUsers);
router.get('/:userId', getUserProfile);
router.post('/:userId/follow', followUser);
router.delete('/:userId/follow', unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

export default router;