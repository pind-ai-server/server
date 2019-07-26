const Question = require('../models/question')

class ControllerQuestion {
    static create(req, res, next) {
        let input = { ...req.body }
        Question.create(input)
            .then(data => {
                res.status(201).json(data)
            })
            .catch(next)
    }
    static findAll(req, res, next) {
        Question.find()
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
    static update(req, res, next) {
        let input = { ...req.body }
        Question.findOneAndUpdate({ _id: req.params.id }, input, { new: true })
            .then(user => {
                res.status(200).json(user)
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

module.exports = ControllerQuestion