const route = require('express').Router()
const { ControllerQuestion } = require('../controllers')

route.get('/', ControllerQuestion.create)
route.get('/', ControllerQuestion.findAll)
route.get('/:id', ControllerQuestion.findOne)
route.put('/:id', ControllerQuestion.update)
route.delete('/:id', ControllerQuestion.delete)


module.exports = route