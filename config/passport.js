const localStrategy = require('passport-local').Strategy,
      mongoose      = require('mongoose'),
      bcrypt        = require('bcrypt'),
      User          = require('../models/User');

module.exports = function(passport){
    passport.use(
        new localStrategy({usernameField : 'email'} , (email , password , done)=>{
            // Match User
            User.findOne({email : email})
            .then((user)=>{
                if(!user){
                   return done(null , false , {msg : "User Doesn't Exist"});
                }
                // Match Passwords 
                bcrypt.compare(password , user.password , (err , isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null , user);
                    }else{
                        return done(null , false , {msg : 'Password Incorrect'});
                    }
                });

            })
            .catch(err => console.log(err));
        })
    );
    // seraializing user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    // unserializing 
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}



