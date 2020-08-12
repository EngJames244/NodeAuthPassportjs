const express = require('express'),
      router  = express.Router(),
      bcrypt  = require('bcrypt'),
      passport = require('passport'),
      User    = require('../models/User');

// Passport Configuration
require('../config/passport')(passport);
router.get('/register' , (req , res)=>{
    res.render("pages/register");
});
router.get('/login' , (req , res)=>{
    res.render("pages/login");
});

router.post('/register' , (req , res)=>{
    const {name , email , password , confirmpass} = req.body;
    const errors = [];
    // Check Password Equality
    if(password !== confirmpass){
        errors.push({msg : "Two Passwords don't match "});
    }
    if(errors.length > 0) {
        res.render('pages/register' , {
            errors
        });
    }
    else{
        User.findOne({email : email} , (err , user)=>{
            if(user){
                // User Exist 
                errors.push({msg : 'User Alreay exist'});
                res.render('pages/register' , {errors});
            }else{
                const newUser = new User({
                    name : name , 
                    email : email , 
                    password : password
                });
                // Hash Password Before Saving
                bcrypt.genSalt(10 , (err , salt)=>{
                    bcrypt.hash(newUser.password , salt , (err , hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                           // Save User 
                        newUser.save((err)=>{
                        if(err) throw err;
                        res.redirect('/users/login');
                    });
                    });
                });
              
            }
        })
    }
});
// Login Handle 
router.post('/login' , (req , res , next)=>{
    passport.authenticate('local' , ({
        successRedirect : '/profile' , 
        failureRedirect : '/users/login',
        failureFlash : true
    }))(req , res , next);
});

// Logout Handle 
router.get('/logout' , (req , res)=>{
    req.logout();
    res.redirect('/users/login');
});
module.exports = router;