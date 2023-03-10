const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('./utis/auth');
const sequelize = require('./config/connection');

//get all post
router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['id', 'post_text', 'title', 'created_at'],
    include: {
      model: User,
      attributes: ['username']
    }
  }),
  {
    model: User,
    attributes: ['username']
  }
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//create a new post
router.post('/', withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    post_text: req.body.post_text,
    user_id: req.session.user_id
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.delete('/:id', withAuth, (req, res) => {
    // delete a post by its `id` value
    Post.destroy ({
      where: {
        id: req.params.id
      }
    })
    .then(dbPostData => {
      if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id'});
          return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
  })  
});

router.put('/:id', (req, res) => {
  // update a post by its `id` value
  Post.update(req.body, {
    where: {
        id: req.params.id
    }
  })
    .then(dbPostData => {
        if (!dbPostData[0]) {
            res.status(404).json({ message: 'No post found with this particular id'});
            return;
        }
        res.json(dbPostData);
  })
    .catch(err => {
        console.log(err); 
        res.status(500).json(err);
  });
});

module.exports = router;
