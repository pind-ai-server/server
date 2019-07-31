/* istanbul ignore else */
if (process.env.NODE_ENV || process.env.NODE_ENV == 'development') {
   require('dotenv').config()
   console.log('masuk dotenv')
}
const express = require('express')
const cors = require('cors')
const route = require('./routes')
const app = express()
const mongoose = require('mongoose')
const mongooseConnect = require('./helpers/mongooseConnect')
const errorhandler = require('./helpers/errorHandler')

const port = process.env.PORT
/* istanbul ignore next */
let database = process.env.ATLASS_PASS ? `mongodb+srv://root:${process.env.ATLASS_PASS}@cluster0-qtp0t.gcp.mongodb.net/namaDB?retryWrites=true&w=majority` : process.env.NODE_ENV === 'test' ? process.env.mongoURLTest : process.env.mongoURLDev

mongooseConnect(database, mongoose)


mongoose.set('useFindAndModify', false);

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(route)

app.use(errorhandler)

app.listen(port, () => {
   console.log(`listening on port: ${port}!`)
})

module.exports = app