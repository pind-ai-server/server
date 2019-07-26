const mongoose = require('mongoose')

let answerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  score: {
    type: String,
  },
  answers: {
    type: Array,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }
},{ timestamps: true })

let Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer
