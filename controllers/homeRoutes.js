const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection')
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    // Get all posts and JOIN with user data
   Post.findAll({
      attributes: [
        'id', 'post_text', 'title', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: text}));
      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

//sign up page
router.get('/signup', (req, res) => {
  res.render('signup');
});


router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id','post_text','title','created_at'],
    include: [
      { 
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id','created_at'],
        include: {
          model: User,
          attributes: ['username']
      }}]
  })
  .then(dbPostData =>{
    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id'});
      return;
    }
    const post = dbPostData.get({ plain: true});

    res.render('single-post', { post, loggedIn: req.session.loggedIn});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


module.exports = router;
