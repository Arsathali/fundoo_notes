import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { createNote, 
    togglePin ,
    getAllNotes , 
    getSingleNote, 
    updateNote , 
    deleteNote ,
    toggleArchive,
    restoreNote,
    changeColor,
    addReminder,
    deleteReminder,
    getLabelsOfNote,
    addLabelToNote,
    removeLabelFromNote,
    getArchivedNotes,
    getTrashNotes
} from "../controller/note.controller.js";

const router = Router();

/** 
 * NOTE - ARCHIVE / DELETE
 */
router.get('/note/archive' , auth , getArchivedNotes);
router.get('/note/trash' , auth , getTrashNotes);

router.post('/note', auth , createNote);
router.get('/note', auth , getAllNotes);
router.get('/note/:noteId', auth , getSingleNote);
router.patch('/note/:noteId' , auth , updateNote);
router.delete('/note/:noteId' , auth , deleteNote);
router.patch('/note/:noteId/pin', auth , togglePin);
router.patch('/note/:noteId/archive', auth , toggleArchive);
router.patch('/note/:noteId/restore', auth, restoreNote);
router.patch('/note/:noteId/color', auth , changeColor);
router.patch('/note/:noteId/reminder', auth , addReminder);
router.delete('/note/:noteId/reminder', auth , deleteReminder);

/**
 * NOTE - LABEL RELATION
 */
router.get('/note/:noteId/label' , auth , getLabelsOfNote);
router.patch('/note/:noteId/label/:labelId', auth , addLabelToNote);
router.delete('/note/:noteId/label/:labelId', auth , removeLabelFromNote);




export default router;