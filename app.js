/* istanbul ignore else */
if (process.env.NODE_ENV) {
   require('dotenv').config();
}
const express = require('express')
const cors = require('cors')
const route = require('./routes')
const mongoose = require('mongoose')
const app = express()
const { errorHandling } = require ('./middlewares/errorHandling')
const port = 3000

/* istanbul ignore next */
let database = process.env.ATLASS_PASS ? `mongodb+srv://root:${process.env.ATLASS_PASS}@cluster0-qtp0t.gcp.mongodb.net/namaDB?retryWrites=true&w=majority` : 'mongodb://localhost:27017/pindai' + process.env.NODE_ENV
mongoose.connect(database, { useNewUrlParser: true }, function (err) {
/* istanbul ignore next */   
   if (err) console.log('connection error')
   else console.log('mongoose is connected')
})
mongoose.set('useFindAndModify', false);

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(route)

app.use(function (err, req, res, next) {
   return errorHandling(err,req,res,next)
})

app.listen(port, () => {
   console.log(`listening on port: ${port}!`)
})

module.exports = app