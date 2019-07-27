/* istanbul ignore file */
const route = require('express').Router()
const user = require('./user')
const answer = require('./answer')
const setSoal = require('./setSoal')

route.get('/', (req, res) => {res.status(200).json({message: 'Connect'})})
route.use('/users', user)
route.use('/setSoal', setSoal)
route.use('/answers', answer)
route.use('/*', (req, res) => res.status(404).json({error: 'Not Found :('}))

module.exports = route