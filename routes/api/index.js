const router = require('express').Router();
const usersRoutes = require('./usersRoutes');
const thoughtRoutes = require('./thoughtRoutes');

router.use('/users', usersRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;

