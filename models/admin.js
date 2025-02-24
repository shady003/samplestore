const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const adminSchema  = mongoose.Schema({
    username : String ,
    email    : String ,
    password : String ,
    secret   : {
        type : String ,
        default : "aquickbrownfoxjumpsoveralazydog"
    },
    age      : Number 
})
module.exports = mongoose.model('admin',adminSchema);