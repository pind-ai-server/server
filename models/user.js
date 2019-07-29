const mongoose = require('mongoose')
const Schema = mongoose.Schema
let userSchema = new Schema({
    userName : {
        type : String,
        required : [true, `username is required`]
    },
    UserId : {
        type : String,
        required : [true, 'UserId is required']
    },
    email : {
        type : String,
        validate : [{
            validator: function validateEmail(email) 
                {
                    var re = /\S+@\S+\.\S+/;
                    return re.test(email);
                },
                message: props => `${props.value} is not a valid email`
        }
    ],
        required : [true, 'email must be inserted'],
    },
    photoUrl : {
        type : String,
        required : [true, 'photoUrl is required']  
    },
    setSoal : [{type : Schema.Types.ObjectId, ref : "setSoal"}]
})
let User = mongoose.model('user',userSchema)
module.exports = User