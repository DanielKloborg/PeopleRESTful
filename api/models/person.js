const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true}
});


module.exports = mongoose.model('Person',personSchema);