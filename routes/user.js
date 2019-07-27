const route = require('express').Router()
const { ControllerUser } = require('../controllers')

route.post('/login', ControllerUser.login)

module.exports = route