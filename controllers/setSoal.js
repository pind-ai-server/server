const Question = require('../models/setSoal')

class ControllerSetSoal {
    static create(req, res, next) {
        let input = { ...req.body }
        Question.create(input)
            .then(data => {
                res.status(201).json(data)
            })
            .catch(next)
    }
    static findAll(req, res, next) {
        Question.find().populate('answers')
            .then(data => {
                res.status(200).json(data)
            })
            .catch(next)
    }
    static findOne(req, res, next) {
        Question.findOne({ _id: req.params.id })
            .then(user => {
                res.status(200).json(user)
            })
            .catch(next)
    }

    static findUserSoal(req,res,next){
        Question.find({UserId : req.params.userId})
        .then(user =>{
            res.status(200).json(user)
        })
        .catch(next)
    }

    static update(req, res, next) {
        let input = { ...req.body }
        Question.findOneAndUpdate({ _id: req.params.id }, input, { new: true })
            .then(user => {
                res.status(200).json(user)
            })
            .catch(next)
    }

    static keyUpdate(req,res,next){
        let input = { ...req.body }
        Question.findOneAndUpdate({_id : req.params.id}, input, { new : true })
            .then(question =>{
                res.status(200).json(question)
            })
            .catch(next)
    }

    static delete(req, res, next) {
        Question.findOneAndDelete({ _id: req.params.id })
            .then(user => {
                res.status(200).json({ message: 'delete successfully' })
            })
            .catch(next)
    }
}

module.exports = ControllerSetSoal