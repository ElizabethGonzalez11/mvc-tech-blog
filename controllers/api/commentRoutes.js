const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//get all comments
router.get('/', async (req, res) => {
  const commentData = await Comment.findAll().catch((err) => { 
      res.json(err);
    });
      const comments = commentData.map((comment) => comment.get({ plain: true }));
      res.render('all', { dishes });
    });

// route to get one comment
router.get('/comment/:id', async (req, res) => {
  try{ 
      const commentData = await Comment.findByPk(req.params.id);
      if(!CommentData) {
          res.status(404).json({message: 'No comment found!'});
          return;
      }
      const comment = commentData.get({ plain: true });
      res.render('comment', comment);
    } catch (err) {
        res.status(500).json(err);
    };     
});

module.exports = router;
