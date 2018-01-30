var express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');
const Admin = require('../models/admin');


router.post('/authenticate',(req,res,next)=>{


  const password = req.body.password;
const username = req.body.username; 

Admin.getAdminByUsername(username,(err,admin)=>{
if(err) throw err;
if(!admin){
  return res.json({success:false,msg:'Admin not found'});
}
if(password==admin.password){
 const token = jwt.sign({data:admin},config.secret,{
        expiresIn : 604800
    });

    res.json({
        success :true,
        token : 'Bearer '+token,
        user:{
            id : admin._id,
            username:admin.username,
            

        }
    });
}else{
   return res.json({success:false,msg:'Wrong Password'});
}


});
 

});





module.exports = router;