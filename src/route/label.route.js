import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { createLabel,
         updateLabel,
         getLabels,
         deleteLabel,
         getNotesByLabel
 } from "../controller/label.controller.js";

const router = Router();

router.post('/label', auth , createLabel);
router.get('/label', auth , getLabels);
router.patch('/label/:labelId', auth , updateLabel);
router.delete('/label/:labelId', auth , deleteLabel);

/**
 * NOTE -LABEL RELATION
 */
router.get("/label/:labelId/note", auth, getNotesByLabel);

export default router;