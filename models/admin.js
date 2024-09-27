const mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/SampleDB`);
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