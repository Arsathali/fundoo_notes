import mongoose, { Mongoose } from "mongoose";


const noteSchema = new mongoose.Schema(
    {
        title : {
            type : mongoose.Schema.Types.String,
            trim: true,
            default: ""
        },

        content: {
            type: mongoose.Schema.Types.String,
            required: true,
            trim: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        labelId : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Label",
            }
        ],

        isPinned: {
            type: Boolean,
            default: false
        },

        isArchived: {
            type: Boolean,
            default: false
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        color: {
            type: String,
            default: "#ffffff"
        },

        reminder: {
            type: Date,
            default: null
        }
    }, {timestamps: true} )

const Note = mongoose.model("Note",noteSchema);

export default Note;