const route = require('express').Router()
const { ControllerAnswer } = require('../controllers')
const {multer, sendUploadToGCS}= require('../helpers/imageUpload')
// const parseFormData = require('../helpers/parseFormData')

route.post('/', multer.single('image'), sendUploadToGCS, ControllerAnswer.create)
route.get('/', ControllerAnswer.findAll)
route.get('/:id', ControllerAnswer.findOne)
route.put('/:id', ControllerAnswer.update)
route.delete('/:id', ControllerAnswer.delete)

module.exports = route