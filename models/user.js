const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const userSchema = mongoose.Schema({
    username : String ,
    email    : String ,
    password : String ,
    age      : Number ,
    longitude : Number,
    latitude : Number
});
module.exports = mongoose.model('user',userSchema);