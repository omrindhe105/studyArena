import mongoose, { mongo } from "mongoose";

const NoteSchema = new mongoose.Schema({
  notes: {
    type: String,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.note || mongoose.model("note", NoteSchema);
