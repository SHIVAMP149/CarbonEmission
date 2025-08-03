import Community from '../models/community.js';
import Post from '../models/Post.js';

export const createCommunity = async (req, res) => {
  try {
    const { name, description, tags } = req.body;
    const exists = await Community.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Community name already taken' });

    const community = await Community.create({
      name, description, tags, members: [req.user._id]
    });

    res.status(201).json(community);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create community' });
  }
};

export const joinCommunity = async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (!community) return res.status(404).json({ message: 'Community not found' });

  if (!community.members.includes(req.user._id)) {
    community.members.push(req.user._id);
    await community.save();
  }

  res.json({ message: 'Joined successfully' });
};

export const listCommunities = async (req, res) => {
  const communities = await Community.find().select('name description tags');
  res.json(communities);
};

export const getCommunityDetails = async (req, res) => {
  const community = await Community.findById(req.params.id).populate('members', 'name');
  const posts = await Post.find({ communityId: community._id }).populate('userId', 'name');

  res.json({ community, posts });
};

export const createPost = async (req, res) => {
  const post = await Post.create({
    communityId: req.params.id,
    userId: req.user._id,
    content: req.body.content
  });

  res.status(201).json(post);
};

export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.comments.push({ userId: req.user._id, text: req.body.text });
  await post.save();

  res.status(201).json({ message: 'Comment added' });
};
