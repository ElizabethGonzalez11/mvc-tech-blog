const router = require('express').Router();
const { User, Post, Comment } = require('../models');

router.get('/', (req, res) => {
  User.findAll ({
    attributes: { exclude: ['password']}
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// find one category by its `id` value
// be sure to include its associated Products

router.get('/:id',  (req, res) => {
  User.findOne({
    attributes: {exclude: ['password']}
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_text', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        includes: {
          model: Post,
          attributes: ['title']
        }
      }
    ]
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id'}); 
      return; 
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//verify users and login
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'no user with this email '});
      return;
    }
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json ({message: 'incorrect password'});
      return;
    }
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.userename = dbUserData.username;
      req.session.loggedIn = true;

      res.json ({ user: dbUserData, message: 'You are now logged in'});
    });
  });
});
  
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
