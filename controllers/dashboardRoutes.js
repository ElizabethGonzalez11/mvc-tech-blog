const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

//display post by user
// be sure to include its associated Products
router.get('/', withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [ 'id','post_text','title','created_at'],
    include: [
      {
        model: Comment,
        attributes: [ 'id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ] 
  })
  .then (dbPostData => {
    const posts = dbPostData.map(post => post.get({ plain: true}));
    res.render('dashboard', { posts, loggedIn: true});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
})

module.exports = router;