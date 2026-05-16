import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as NoteController from "../controller/note.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes Management APIs
 */

/**
 * @swagger
 * /note/archive:
 *   get:
 *     summary: Get Archived Notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archived notes fetched successfully
 */
router.get('/note/archive' , auth , NoteController.getArchivedNotes);

/**
 * @swagger
 * /note/trash:
 *   get:
 *     summary: Get Trash Notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trash notes fetched successfully
 */
router.get('/note/trash' , auth , NoteController.getTrashNotes);

/**
 * @swagger
 * /note:
 *   post:
 *     summary: Create Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               labels:
 *                 type: array
 *                 items:
 *                   type: string
 *               collaborators:
 *                 type: array
 *                 items:
 *                   type: string
 *               color:
 *                 type: string
 *               reminder:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 */
router.post('/note', auth , NoteController.createNote);

/**
 * @swagger
 * /note:
 *   get:
 *     summary: Get All Notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes fetched successfully
 */
router.get('/note', auth , NoteController.getAllNotes);

/**
 * @swagger
 * /note/{noteId}:
 *   get:
 *     summary: Get Single Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note fetched successfully
 */
router.get('/note/:noteId', auth , NoteController.getSingleNote);

/**
 * @swagger
 * /note/{noteId}:
 *   patch:
 *     summary: Update Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 */
router.patch('/note/:noteId' , auth , NoteController.updateNote);

/**
 * @swagger
 * /note/{noteId}:
 *   delete:
 *     summary: Delete Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 */
router.delete('/note/:noteId' , auth , NoteController.deleteNote);

/**
 * @swagger
 * /note/{noteId}/pin:
 *   patch:
 *     summary: Toggle Pin Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note pin toggled successfully
 */
router.patch('/note/:noteId/pin', auth , NoteController.togglePin);

/**
 * @swagger
 * /note/{noteId}/archive:
 *   patch:
 *     summary: Toggle Archive Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note archive toggled successfully
 */
router.patch('/note/:noteId/archive', auth , NoteController.toggleArchive);

/**
 * @swagger
 * /note/{noteId}/restore:
 *   patch:
 *     summary: Restore Deleted Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note restored successfully
 */
router.patch('/note/:noteId/restore', auth, NoteController.restoreNote);

/**
 * @swagger
 * /note/{noteId}/color:
 *   patch:
 *     summary: Change Note Color
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note color updated successfully
 */
router.patch('/note/:noteId/color', auth , NoteController.changeColor);

/**
 * @swagger
 * /note/{noteId}/reminder:
 *   patch:
 *     summary: Add Reminder To Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reminder added successfully
 */
router.patch('/note/:noteId/reminder', auth , NoteController.addReminder);

/**
 * @swagger
 * /note/{noteId}/reminder:
 *   delete:
 *     summary: Delete Reminder From Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reminder deleted successfully
 */
router.delete('/note/:noteId/reminder', auth , NoteController.deleteReminder);

/**
 * @swagger
 * /note/{noteId}/collaborator:
 *   post:
 *     summary: Add Collaborators To Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collaborators:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Collaborators added successfully
 */
router.post('/note/:noteId/collaborator', auth , NoteController.addCollaborators);

/**
 * @swagger
 * /note/{noteId}/label:
 *   get:
 *     summary: Get Labels Of Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Labels fetched successfully
 */
router.get('/note/:noteId/label' , auth , NoteController.getLabelsOfNote);

/**
 * @swagger
 * /note/{noteId}/label/{labelId}:
 *   patch:
 *     summary: Add Label To Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: labelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Label added to note successfully
 */
router.patch('/note/:noteId/label/:labelId', auth , NoteController.addLabelToNote);

/**
 * @swagger
 * /note/{noteId}/label/{labelId}:
 *   delete:
 *     summary: Remove Label From Note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: labelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Label removed successfully
 */
router.delete('/note/:noteId/label/:labelId', auth , NoteController.removeLabelFromNote);

export default router;