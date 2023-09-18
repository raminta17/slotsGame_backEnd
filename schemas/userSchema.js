const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required:true,
        default: 200
    }
})

const user = mongoose.model('slots_users', userSchema);

module.exports = user;