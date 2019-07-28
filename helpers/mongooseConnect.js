module.exports = async function(url,mongoose){
   try{
       await mongoose.connect(url,{ useNewUrlParser : true })
        return true
    }catch(err){
        console.log(err)
        return false
   }
}