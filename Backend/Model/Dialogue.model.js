import mongoose from "mongoose";

const DialogueSchema = new mongoose.Schema({
  
character: {
    type: String,
    required: true,
    trim: true,
  },
 
dialogue: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number], 
    required: true,
  },
},{ collection: "avengers_endgame" }); 

export const avengers_endgame = mongoose.model("avengers_endgame", DialogueSchema);
