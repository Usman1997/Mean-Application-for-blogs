const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const Admin = require('../models/admin');
const config = require('../config/database');

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest  = ExtractJWT.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    passport.use(new JWTStrategy(opts,(jwt_payload,done) =>{
     console.log(jwt_payload);
     
   User.getUserById(jwt_payload.data._id,(err,user) => {
 
           if(err){
               return done(err,false);
           }
           if(user){
            console.log(user);
               return done(null,user);
               
           }else{
               return done(null,false);

        }


    });

    }));
    
}

