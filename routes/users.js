var express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Blog = require('../models/blog');
const config = require('../config/database');
const Admin = require('../models/admin');
router.post('/register',(req,res,next)=>{
    let newUser = new User({
       name: req.body.name,
       username:req.body.username,
       email:req.body.email,
       password:req.body.password


    });
User.addUser(newUser,(err,user)=>{

   if(err){
       res.json({success:false,msg:'Failed to register User'+err});
   }else{
       res.json({success:true,msg:'User Registered'});
    }
});
});

router.post('/authenticate',(req,res,next)=> {


const password = req.body.password;
const username =req.body.username;
User.getUserByUsername(username,(err,user) =>{
    if(err) throw err;

    if(!user){
        return res.json({success:false,msg:'user not found'});


    }


User.comparePassword(password,user.password,(err,isMatch)=>{

    if(err) throw err;

if(isMatch){
    const token = jwt.sign({data:user},config.secret,{
        expiresIn : 604800
    });

    res.json({
        success :true,
        token : 'Bearer '+token,
        user:{
            id : user._id,
            name:user.name,
            username:user.username,
            email:user.email

        }
    });

}else{
    return res.json({success:false,msg:'Wrong Password'});
}
});
});
});

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({user:req.user});

});



router.post('/newBlog',(req,res,next)=>{
  if(!req.body.title){
    res.json({success:false,msg:'Title is required'});
  }
  else if(!req.body.body){
      res.json({success:false,msg:'Body is required'});
  }
  else if(!req.body.createdBy){
    res.json({success:false,msg:'Creator is required'});
  }
  else{
    const blog = new Blog({
       title : req.body.title,
       body: req.body.body,
       createdBy : req.body.createdBy,


    });
    blog.save((err)=>{


     if(err){
      res.json({success:false,msg:err});
}
else{
  res.json({success:true,msg:'Blog saved'});
}


    });
  }
});

router.get('/getBlogs',(req,res,next)=>{

 Blog.find({},(err,blogs)=>{

 if(err){
  res.json({success:false,msg:err});
 }
 else if(!blogs){
  res.json({success:false,msg:'No Blogs'});

 }else{
  res.json({success:true,blogs:blogs});
 }

 }).sort({'_id':-1});

});

router.get('/getSingleBlog/:id',(req,res,next)=>{

   if(!req.params.id){
       res.json({success:false,msg:'BLOG Id not provided'});
   }
   else{
       Blog.findOne({_id:req.params.id},(err,blog)=>{
       if(err){
        res.json({success:false,msg:err});
       }
       else if(!blog){
        res.json({success:false,msg:'BLOG not found'});
       }
       else{
        res.json({success:true,blog:blog});
       }



       });
   }
});

router.put('/UpdateBlog',(req,res,next)=>{

    if(!req.body._id){
        res.json({success:false,msg:'No Blog Id is provided'});
        console.log(req.body._id);
        console.log(erq.body.id);
        console.log(req.body.title);
        console.log(req.body.body);
    }
    else{
        Blog.findOne({_id:req.body._id},(err,blog)=>{
       if(err){
        res.json({success:false,msg:err});
       }
       else if(!blog){
        res.json({success:false,msg:'Blog Id was not found'});
        console.log(req.body._id);
        console.log(erq.body.id);
        console.log(req.body.title);
        console.log(req.body.body);
    
       }else{
        blog.title = req.body.title
        blog.body = req.body.body;
        blog.save((err)=>{
       if(err){
              res.json({success:false,msg:err});
      }else{
        res.json({success:true,msg:'Blog Updated'});
        console.log(req.body.name);
         }
                       });
                   }
               
           
       
    
        
    });
}
    
});

router.delete('/deleteBlog/:id',(req,res,next)=>{
if(!req.params.id){
    res.json({success:false,msg:'ID not provided'});
}else{
  Blog.findOne({_id:req.params.id},(err,blog)=>{
      if(err){
        res.json({success:false,msg:'Error in deleting blog'});
      }else if(!blog){
        res.json({success:false,msg:'Blog not found'});
      }else{
          blog.remove((err)=>{
              if(err){
                res.json({success:false,msg:err});
              }else{
                res.json({success:true,msg:'Blog Deleted Successfully'});
              }
          })
      }
  })
}

});


module.exports = router;