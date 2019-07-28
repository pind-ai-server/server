/* istanbul ignore file */

module.exports = function(err, req, res, next) {
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
};