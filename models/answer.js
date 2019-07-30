const mongoose = require('mongoose')
const setSoal = require('../models/setSoal')

let answerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  score: {
    type: String,
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
  this.password = hash(this.password)
  setSoal.findOne({_id: this.setSoalId})
  .then(data => {
    let score = 0
    let totalNumber = Object.keys(data.answerKey).length
    for (let key in data.answerKey) {
      if(this.answers[key] == data.answerKey[key]) score += 100/totalNumber
      else score -= 100/totalNumber
    } 
    this.score = score
  })
  next()
})

let Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer