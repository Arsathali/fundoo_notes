import mongoose from "mongoose";

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true   
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

//  Ensure unique label per user
labelSchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model("Label", labelSchema);