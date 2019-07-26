const Answer = require('../models/answer')

class ControllerAnswer {
    static create(req, res, next) {
        let input = { ...req.body }
        Answer.create(input)
            .then(data => {
                res.status(201).json(data)
            })
            .catch(next)
    }
    static findAll(req, res, next) {
        Answer.find().populate('Questioin')
            .then(data => {
                res.status(200).json(data)
            })
            .catch(next)
    }
    static findOne(req, res, next) {
        Answer.findOne({ _id: req.params.id }).populate('Questioin')
            .then(data => {
                res.status(200).json(data)
            })
            .catch(next)
    }
    static update(req, res, next) {
        let input = { ...req.body }
        Answer.findOneAndUpdate({ _id: req.params.id }, input, { new: true })
            .then(data => {
                res.status(200).json(data)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        Answer.findOneAndDelete({ _id: req.params.id })
            .then(data => {
                res.status(200).json({ message: 'delete successfully' })
            })
            .catch(next)
    }
}

module.exports = ControllerAnswer