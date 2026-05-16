import { 
    createNoteService, 
    getAllNotesService , 
    getSingleNoteService ,
    updateNoteService ,
    deleteNoteService,
    togglePinService, 
    toggleArchiveService,
    restoreNoteService,
    changeColorService,
    addReminderService,
    deleteReminderService,
    getLabelsOfNoteService,
    addLabelToNoteService,
    removeLabelFromNoteService,
    getArchivedNotesService,
    getTrashNotesService,
    addCollaboratorService
    }
     from "../service/note.service.js"
import { collaboratorSchema } from "../validation/collaborator.validator.js";
import AppError from "../utils/AppError.js";
import { noteSchema } from "../validation/note.validator.js";


/**
 * CREATE NOTES
 */
export const createNote = async (req , res , next) => {

    try {

        /**
        * VALIDATION 
        */
        const {error} = noteSchema.validate(req.body);
                
        if(error){
            throw new AppError(error.details[0].message,400);
        }

        const note =  await createNoteService(req.body, req.userId);

        return res.status(201).json({
            success: true,
            message: "Note created",
            data: note
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

/**
 * GET ALL NOTES
 */
export const getAllNotes = async (req , res , next) => {

    try {
        const notes = await getAllNotesService(req.userId);

        res.status(200).send(notes);

    }catch(err){
        next(err);
    }
}

/**
 * GET SINGLE NOTE
 */
export const getSingleNote = async (req , res , next) => {

    try {

        const noteId = req.params.noteId;
        console.log(noteId);
        const note = await getSingleNoteService(noteId , req.userId);
        res.status(200).send(note);
        
    }catch(err){
        next(err);
    }
}

/**
 * UPDATE NOTE
 */
export const updateNote = async (req, res, next) => {

  try{  
        const note = await updateNoteService(
            req.params.noteId,
            req.userId,
            req.body
        );

        res.status(200).json({ success: true, data: note });
    }catch(err){
        next(err);
    }
};

/**
 * DELETE NOTE
 */ 
export const deleteNote = async (req, res, next) => {

  try{

    const note = await deleteNoteService(
        req.params.noteId,
        req.userId
    );

    res.status(200).json({ success: true , data: note });

  }catch(err){
    next(err);
  }
};

/**
 * TOGGLE PIN
 */
export const togglePin = async (req, res, next) => {

    try {

        const result = await togglePinService(req.params.noteId , req.userId);
        res.json({success: true , data : result});

    }catch(err){
        next(err);
    }

}

/**
 * TOGGLE ARCHIVE
 */
export const toggleArchive = async (req, res, next) => {
    try {

        const result = await toggleArchiveService(req.params.noteId , req.userId);
        res.json({success: true , data : result});

    }catch(err){
        next(err);
    }
}

/**
 * RESTORE NOTE
 */
export const restoreNote = async (req, res, next) => {
    try {

        const result = await restoreNoteService(req.params.noteId , req.userId);
        res.json({success: true , data : result});

    }catch(err){
        next(err);
    }
}

/**
 * CHANGE COLOR
 */
export const changeColor = async (req, res, next) => {
    try {

        const result = await changeColorService(req.params.noteId , req.userId , req.body.color);
        res.json({success: true , data : result});

    }catch(err){
        next(err);
    }
}

/**
 * ADD REMINDER
 */
export const addReminder = async (req, res, next) => {
    try {        
        const result = await addReminderService(req.params.noteId , req.userId , req.body.reminder);
        res.json({success: true , data : result});
    }catch(err){
        next(err);
    }
}

/**
 * DELETE REMINDER
 */
export const deleteReminder = async (req, res, next) => {
    try {
        const result = await deleteReminderService(req.params.noteId , req.userId);
        res.json({success: true , data : result});
    }catch(err){
        next(err);
    }
}

export const addCollaborators =  async (req, res, next) => {

    try {

       /**
        * VALIDATION 
        */
        const {error} = collaboratorSchema.validate(req.body);
       
        if(error){
              throw new AppError(error.details[0].message,400);
        }

       const note = await addCollaboratorService(req.userId , req.params.noteId , req.body.collaborators);
       res.json({ data : note});
    }catch(err){
        next(err);
    }
} 


/**
 *  GET LABELS OF NOTE
 */
export const getLabelsOfNote = async (req, res, next) => {

    try {
        const labels =  await getLabelsOfNoteService(req.userId , req.params.noteId);
        if(labels) res.send({message : "success", data : labels});
        else res.send({message : "No Labels in the Note"});
    }catch(err){
        next(err);
    }
}

/**
 * ADD LABEL TO A NOTE
 */
export const addLabelToNote = async (req, res, next) => {
    try {
        const labels =  await addLabelToNoteService(req.userId , req.params.noteId , req.params.labelId);
        if(labels) res.send({message : "success", data : labels});
        else res.send({message : "No Labels in the Note"});
    }catch(err){
        next(err);
    }
}

/**
 * DELETE LABEL FROM A NOTE
 */
export const removeLabelFromNote = async (req, res, next) => {
    try {
        const labels =  await removeLabelFromNoteService(req.userId , req.params.noteId , req.params.labelId);
        if(labels) res.send({message : "success", data : labels});
    }catch(err){
        next(err);
    }
}


/**
 * GET ARCHIVE NOTES
 */
export const getArchivedNotes = async (req, res, next) => {
    try {
        const notes =  await getArchivedNotesService(req.userId);
        if(notes) res.send({message : "success", data : notes});
    }catch(err){
        next(err);
    }
}

/**
 * GET TRASH NOTES
 */
export const getTrashNotes = async (req, res, next) => {
    try {
        const notes =  await getTrashNotesService(req.userId);
        if(notes) res.send({message : "success", data : notes});
    }catch(err){
        next(err);
    }
}
