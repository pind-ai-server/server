const Answer = require('../models/answer')
const axios = require('axios')
const extractAnswer = require('../helpers/extractAnswer')
const extractName = require('../helpers/extractName')

class ControllerAnswer {
    static create(req, res, next) {
        const url = req.file.cloudStoragePublicUrl
        const headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY
        }
        axios({
            url: 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/read/core/asyncBatchAnalyze',
            method: 'POST',
            headers: headers,
            data: {
                "url": url
            }
        })
        .then((data) => {
            setTimeout(() => {
                axios({
                    url: data.headers['operation-location'],
                    method: 'GET',
                    headers: headers
                })
                    .then((result) => {
                        if (result.data.recognitionResults) {
                            const answers = extractAnswer(result.data)
                            const name = extractName(result.data)
                            res.json({
                                status: 'success',
                                data: {
                                    name,
                                    answers,
                                }
                            })
                        } else {
                            throw {
                                status: 'error',
                                data: 'take another photo'
                            }
                        }
                    })
                    .catch(err => {
                        throw {
                            status: 'error',
                            data: 'take another photo'
                        }
                    })
            }, 10000)
        })
        .catch(err => {
            res.json(err)
        })
        // Answer.create(input)
        //     .then(data => {
        //         res.status(201).json(data)
        //     })
        //     .catch(next)
    }
    static findAll(req, res, next) {
        Answer.find().populate('setSoalId')
            .then(data => {
                res.status(200).json(data)
            })
            .catch(next)
    }
    static findOne(req, res, next) {
        Answer.findOne({ _id: req.params.id }).populate('setSoalId')
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