const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const soalSchema = new Schema({
    UserId: {
        type : String,
        require : [ true , 'user id is required']
    },
    title: {
      type : String,
      required : [true , 'title is required']
    },
    folderName : {
      type : String,
      required : [true , 'foldername is required']
    },
    answerKey : Object,
    answers : [{type : Schema.Types.ObjectId, ref : "Answer"}]
});

const setSoal = mongoose.model("setSoal", soalSchema);

module.exports = setSoal;