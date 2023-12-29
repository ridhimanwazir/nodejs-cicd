const express = require('express');
const router = express.Router();

// Define routes for users
router.get('/', (req, res) => {
  res.send('List of users');
});

module.exports = router;
