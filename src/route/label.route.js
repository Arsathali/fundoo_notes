import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { createLabel,
         updateLabel,
         getLabels,
         deleteLabel,
         getNotesByLabel
 } from "../controller/label.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Labels
 *   description: Label APIs
 */

/**
 * @swagger
 * /label:
 *   post:
 *     summary: Create Label
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Label created
 */
router.post('/label', auth , createLabel);

/**
 * @swagger
 * /label:
 *   get:
 *     summary: Get All Labels
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of labels
 */
router.get('/label', auth , getLabels);

/**
 * @swagger
 * /label/{labelId}:
 *   patch:
 *     summary: Update Label
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: labelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Label updated
 */
router.patch('/label/:labelId', auth , updateLabel);

/**
 * @swagger
 * /label/{labelId}:
 *   delete:
 *     summary: Delete Label
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: labelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Label deleted
 */
router.delete('/label/:labelId', auth , deleteLabel);

/**
 * NOTE -LABEL RELATION
 */

/**
 * @swagger
 * /label/{labelId}/note:
 *   get:
 *     summary: Get Notes By Label
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: labelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes fetched successfully
 */
router.get("/label/:labelId/note", auth, getNotesByLabel);

export default router;