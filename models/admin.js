const mongoose = require('mongoose');
const config = require('../config/database');

const AdminSchema = mongoose.Schema({

username: {type:String,required:true},
password: {type:String,required:true},

 
});
 
const Admin = module.exports = mongoose.model('Admins',AdminSchema);

module.exports.getAdminById = function(id,callback){
    Admin.findById(id,callback);
}
module.exports.getAdminByUsername = function(username,callback){
	const query = {username:username}
	Admin.findOne(query,callback);
}
