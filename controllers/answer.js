const Answer = require('../models/answer')
const axios = require('axios')
const extractAnswer = require('../helpers/extractAnswer')
const extractName = require('../helpers/extractName')
const setSoal = require('../models/setSoal')

class ControllerAnswer {
    static create(req, res, next) {
        console.log('masuk create answer server')
        console.log('req.body =======',req.body.setSoalId)
        console.log('req.file =======',req.file)
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
                        console.log('ini result.data', result.data)
                        if (result.data.recognitionResults) {
                            const answers = extractAnswer(result.data)
                            const name = extractName(result.data)
                            console.log('name', name)
                            console.log('answers', answers)
                            if (name.status === 'success' && answers.status === 'success') {
                                // Answer.create(req.body)
                                //     .then(data => {
                                //         return setSoal.findOneAndUpdate({_id: data.setSoalId}, { $push : { answers: data._id} })
                                //     })
                                //     .then(data => {
                                //     res.status(201).json(data)
                                //     })
                                //     .catch(next)
                                res.json({
                                    status: 'success',
                                    data: {
                                        name: name.data,
                                        answers: answers.data,
                                    }
                                })
                            } else {
                                throw {
                                    status: 'error',
                                    data: 'take another photo'
                                }
                            }
                            
                        } else {
                            throw {
                                status: 'error',
                                data: 'take another photo'
                            }
                        }
                    })
                    .catch(err => {
                        console.log('ini err', err)
                        res.json({
                            status: 'error',
                            data: 'take another photo'
                        })
                    })
            }, 10000)
        })
        .catch(err => {
            console.log('ini err', err)
            res.json({
                status: 'error',
                data: 'take another photo'
            })
        })
        
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