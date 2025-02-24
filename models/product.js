const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const productSchema  = mongoose.Schema({
    item: String,
    img : String,
    price: Number,
    description: String
})
module.exports = mongoose.model('item',productSchema);