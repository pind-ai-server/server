if (process.env.NODE_ENV) {
   require('dotenv').config();
}
const express = require('express')
const cors = require('cors')
const route = require('./routes')
const app = express()
const mongoose = require('mongoose')
const mongooseConnect = require('./helpers/mongooseConnect')

const port = process.env.PORT

let database = process.env.ATLASS_PASS ? `mongodb+srv://root:${process.env.ATLASS_PASS}@cluster0-qtp0t.gcp.mongodb.net/namaDB?retryWrites=true&w=majority` : process.env.NODE_ENV === 'test' ? process.env.mongoURLTest : process.env.mongoURLDev

mongooseConnect(database, mongoose)
// .then(()=>{
//    console.log('mongoose is connected')
// })
// .catch(err=>{
//    console.log('connection error')
// })
// mongoose.connect(database,{ useNewUrlParser : true },function(err){
//     if(err) console.log('connection error')
//     else console.log('mongoose is connected')
// })

mongoose.set('useFindAndModify', false);

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(route)

app.use( function(err,req,res,next) {
   console.log("ini errorr handler ===>",err)
   if (err.name == 'ValidationError'){
       let messages = []
       for(key in err.errors){
           if(err.errors[key].reason){
              messages.push(err.errors[key].reason)
           } else {
              messages.push(err.errors[key].message)
           }
       }
       res.status(404).json(messages)
   }

   else if(!err.code) {
     if(err.message.includes('Cast to ObjectId failed')) {
        res.status(404).json({ message : 'Bad request' })
     }else {
        res.status(500).json({ message : 'Internal server error' })
     }
   }

   else {
      if (err.name == 'MongoError') {
         res.status(500).json({ message: err.errmsg })
      } else {
         res.status(err.code).json({ message: err.message })
      }
   }
})

app.listen(port, () => {
   console.log(`listening on port: ${port}!`)
})

module.exports = app