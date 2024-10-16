const mongoose = require("mongoose");
const { Schema } = mongoose;

const Notesschema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  party: {
    type: String,
    required: true,
  },
  voteCount: {
    type: Number,
    required:false,
    default: 0
  },
});
const notes = mongoose.model("Notes", Notesschema);
module.exports = notes;
