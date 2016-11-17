var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    regno: { type: String, required: true },
    name: { type: String, required: true },
    block: { type: String, required: true },
    room: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    programme: { type: String, required: true },
    dsa_marks: {type: Number},
    cao_marks: {type: Number},
    toc_marks: {type: Number}
});

var User = mongoose.model('User', userSchema);
module.exports = {User: User};