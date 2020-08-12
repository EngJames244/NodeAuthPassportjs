const express = require('express'),
      router  = express.Router(),
      { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/' , (req , res)=>{
    res.render('pages/home');
});

router.get('/profile' , (req , res)=>{
    res.render('pages/profile' , {user : req.user});
});
module.exports = router;