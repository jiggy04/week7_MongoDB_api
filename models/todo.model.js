const mongoose = require('mongoose');

const todoschema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
       
    }
}, {timestamps : true})


const Todomodel = mongoose.model('Todo', todoschema)

module.exports = Todomodel

