//some boiler plate info from mini-project

const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const dashboardRoutes = require('./api/dashboardRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/api', dashboardRoutes);


module.exports = router;
