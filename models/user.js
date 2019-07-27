const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    userName : {
        type : String,
        required : [true, `first name is required`]
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
        },
        {
            validator: function(){
                return new Promise((res, rej) =>{
                User.findOne({email: this.email, _id: {$ne: this._id}})
                    .then(data => {
                        if(data) {
                            res(false)
                        } else {
                            res(true)
                        }
                    })
                    .catch(err => {
                        res(false)
                    })
                })
            }, message: 'email already taken'
        }
    ],
        required : [true, 'email must be inserted'],
    },
    setSoal : [{type : Schema.Types.ObjectId, ref : "setSoal"}]
})


let User = mongoose.model('user',userSchema)

module.exports = User