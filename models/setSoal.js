const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const soalSchema = new Schema({
    UserId: {
        type : String,
        required : [ true , 'user id is required']
    },
    title: {
      type : String,
      required : [true , 'title is required']
    },
    folderName : {
      type : String,
    },
    answerKey : Object,
    answers : [{type : Schema.Types.ObjectId, ref : "Answer"}]
});

const setSoal = mongoose.model("setSoal", soalSchema);

module.exports = setSoal;