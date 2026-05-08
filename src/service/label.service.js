import Label from "../model/label.model.js";
import Note from "../model/note.model.js";

export const createLabelService = async (name , userId) => {
    return await Label.create({
        name,
        userId
    });
}

export const updateLabelService = async (labelId , userId , name) => {
    return await Label.findOneAndUpdate(
        {_id : labelId , userId},
        { name },
        { new : true }
    );
}

export const getLabelsService = async (userId) => {
    return await Label.find({userId});
}

export const deleteLabelService = async (userId,labelId) => {

    await Note.updateMany(
        { userId, labelId },
        { $pull: { labelId : labelId } }
    );

    return await Label.findOneAndDelete(
        { _id : labelId , userId },
    );
}

export const getNotesByLabelService = async (userId,labelId) => {
    return await Note.find(
        { userId , labelId : labelId },
    );
}