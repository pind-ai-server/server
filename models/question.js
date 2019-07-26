const mongoose = require('mongoose')

let questionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
},{ timestamps: true })


let Question = mongoose.model('Question', questionSchema)

module.exports = Question