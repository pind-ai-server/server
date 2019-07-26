const route = require('express').Router()
const user = require('./user')

route.get('/', (req, res) => {res.status(200).json({message: 'Connect'})})
route.use('/users', user)
route.use('/questions', question)
route.use('/answers', answer)

route.use('/*', (req, res) => res.status(404).json({error: 'Not Found :('}))

module.exports = route