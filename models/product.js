const mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/SampleDB`);
const productSchema  = mongoose.Schema({
    item: String,
    img : String,
    price: Number,
    description: String
})
module.exports = mongoose.model('item',productSchema);