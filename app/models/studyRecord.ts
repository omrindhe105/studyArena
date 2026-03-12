import mongoose from "mongoose";

const StudySessionSchema = new mongoose.Schema({
  durationMinutes: {
    type: Number,
    required: true,
  },
  sessionType: {
    type: String,
    enum: ["focus", "break"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.StudySession ||
  mongoose.model("StudySession", StudySessionSchema);
