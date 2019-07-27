const Question = require('../models/setSoal')
const User = require('../models/user')
class ControllerSetSoal {
    static create(req, res, next) {
        let input = { ...req.body }
        let passData = ''
        Question.create(input)
            .then(data => {
                passData = data
                return User.findOneAndUpdate({ UserId: data.UserId }, { $push: { setSoal: data._id } }, { new: true })
                })
            .then(user =>{        
                console.log('hasil push ke user ini user',user);
                res.status(201).json(passData)
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