import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createCommunity,
  joinCommunity,
  listCommunities,
  getCommunityDetails,
  createPost,
  addComment
} from '../controllers/communityController.js';

const router = express.Router();

router.post('/', protect, createCommunity);
router.post('/:id/join', protect, joinCommunity);
router.get('/', protect, listCommunities);
router.get('/:id', protect, getCommunityDetails);

router.post('/:id/posts', protect, createPost);
router.post('/posts/:postId/comments', protect, addComment);

export default router;
