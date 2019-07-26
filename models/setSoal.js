const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const soalSchema = new Schema({
    UserId: {
        type : String,
        require : [ true , 'user id is required']
    },
    title: String,
    folderName : {
      type : String,
      required : [true , 'foldername is required']
    },
    answerKey : Object,
    answers : [{type : Schema.Types.ObjectId, ref : "answer"}]
});

const setSoal = mongoose.model("setSoal", soalSchema);

module.exports = setSoal;