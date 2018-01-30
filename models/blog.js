const mongoose = require('mongoose');
const config = require('../config/database');


const BlogSchema = mongoose.Schema({
 

    title:{type:String,required:true},
    body :{type:String,required:true},
    createdBy :{type:String},
    createdAt :{type:Date,Default:Date.now()},
    likes : {type:Number,default:0},
    dislikes : {type:Number,default:0},
    likedBy :{type:Array},
    dislikedBy:{type:Array},
    comments :[
    {
      comment:{type:String},
      commentator:{type:String}
    }
    ]


});

const Blog = module.exports = mongoose.model('Blogs',BlogSchema);







