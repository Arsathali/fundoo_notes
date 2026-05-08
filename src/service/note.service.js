import Note from "../model/note.model.js"
import Label from "../model/label.model.js";
import AppError from "../utils/AppError.js";

export const createNoteService = async (data, userId) =>{

    // Destructure all possible fields (add more if needed)
    const {
        title = "",
        content,
        labels = [],        
        isPinned = false,
        isArchived = false,
        isDeleted = false,
        color = "#ffffff",
        reminder = null
    } = data;

    if (!content) {
        throw new AppError("Content is required", 400);
    }

    //  Normalize + deduplicate labels (REQUEST LEVEL)
    const uniqueLabels = [
        ...new Set(
        labels.map(l => l.trim().toLowerCase())
        )
    ];

    let labelId = [];

    if (uniqueLabels.length > 0) {
        for (let name of uniqueLabels) {

            //  Find or create (DB LEVEL uniqueness)
            let label = await Label.findOne({ name, userId });

            if (!label) {
                try {
                label = await Label.create({ name, userId });
                } catch (err) {
                label = await Label.findOne({ name, userId });
                }
            }

            labelId.push(label._id);
        }
    }

    // Create note with all fields
    const note = await Note.create({
        title,
        content,
        userId,
        labelId,
        isPinned,
        isArchived,
        isDeleted,
        color,
        reminder
    });

    return note;
}


export const getAllNotesService = async (userId) =>{

    const notes = await Note.find({userId , isDeleted : false});
    return notes;
}

export const getSingleNoteService = async (noteId , userId) => {
    const note = await Note.findOne({_id : noteId , userId , isDeleted : false});
    return note;
}


export const updateNoteService = async (noteId, userId, data) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, userId , isDeleted : false},
    data,
    { new: true }
  );
};

export const deleteNoteService = async (noteId, userId) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, userId , isDeleted : false},
    { isDeleted: true },
    { new: true }
  );
};

export const togglePinService = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  note.isPinned = !note.isPinned;
  return await note.save();
};

export const toggleArchiveService = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, userId });
  note.isArchived = !note.isArchived;
  return await note.save();
};

export const restoreNoteService = async (noteId, userId) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { isDeleted: false },
    { new: true }
  );
};

export const changeColorService = async (noteId, userId, color) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { color : color },
    { new: true }
  );
};

export const addReminderService = async (noteId, userId ,reminder) => {
  return await Note.findOneAndUpdate(
     {_id : noteId , userId},
     { reminder},
     { new : true }
  );
}

export const deleteReminderService = async (noteId, userId) => {
  return await Note.findOneAndUpdate(
     {_id : noteId , userId},
     { reminder : null },
     { new : true }
  );
}

export const getLabelsOfNoteService = async (userId , noteId) => {
    return await Note.find(
      {_id : noteId , userId}
    ).populate("labelId");
}

export const addLabelToNoteService = async (userId , noteId , lId) => {

    const label = await Label.findOne({ _id: labelId, userId });
        if (!label) throw new AppError("Invalid label");

    return await Note.findOneAndUpdate(
      {_id : noteId , userId, isDeleted : false},
      { $addToSet : { labelId : lId }},
      { new: true }
    );
}

export const removeLabelFromNoteService = async (userId , noteId , lId) => {
    return await Note.findOneAndUpdate(
      {_id : noteId , userId},
      { $pull : { labelId : lId }},
      { new: true }
    );
}

export const getArchivedNotesService = async (userId) => {
  return await Note.find(
    {userId , isArchived : true , isDeleted : false}
  );
}

export const getTrashNotesService = async (userId) => {
  return await Note.find(
    {userId , isDeleted : true}
  );
}