const route = require('express').Router()
const { ControllerSetSoal } = require('../controllers')

route.get('/', ControllerSetSoal.findAll)
route.get('/:id', ControllerSetSoal.findOne)
route.get('/:userId/users', ControllerSetSoal.findUserSoal)
route.get('/:userId/csv', ControllerSetSoal.generateCSV)
route.post('/', ControllerSetSoal.create)
route.put('/:id', ControllerSetSoal.update)
route.put('/:id/keyUpdate', ControllerSetSoal.keyUpdate)
route.delete('/:id', ControllerSetSoal.delete)

module.exports = route