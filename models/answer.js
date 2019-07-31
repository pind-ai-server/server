const mongoose = require('mongoose')
const setSoal = require('../models/setSoal')

let answerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  score: {
    type: Number,
  },
  answers: {
    type: Object,
  },
  setSoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'setSoal'
  },
  imageUrl : {
    type: String,
  }
},{ timestamps: true })

answerSchema.pre('save', function (next) {
  setSoal.findOne({_id: this.setSoalId})
  .then(data => {
    let score = 0
    let totalNumber = Object.keys(data.answerKey).length
    let newAnswer = {}
    for (let key in data.answerKey) {
      newAnswer[key] = this.answers[key] 
    }
    this.answers = newAnswer
    for (let key in data.answerKey) {
      if(this.answers[key] == data.answerKey[key]) score += 100/totalNumber
    } 
    this.score = Math.round(score)
    next()
  })
})

let Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer