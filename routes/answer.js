const route = require('express').Router()
const { ControllerAnswer } = require('../controllers')

route.get('/', ControllerAnswer.create)
route.get('/', ControllerAnswer.findAll)
route.get('/:id', ControllerAnswer.findOne)
route.put('/:id', ControllerAnswer.update)
route.delete('/:id', ControllerAnswer.delete)

module.exports = route