import Label from "../model/label.model.js"
import { createLabelService,
         updateLabelService,
         getLabelsService,
         deleteLabelService,
         getNotesByLabelService
 } from "../service/label.service.js";
import { labelSchema } from "../validation/label.validation.js";

/**
 * CREATE LABEL
 */
export const createLabel = async (req, res, next) => {
    try {

        /**
        * VALIDATION 
        */
        const {error} = labelSchema.validate(req.body);
        
        if(error){
            throw new AppError(error.details[0].message,400);
        }
        
        const label =  await createLabelService(req.body.name, req.userId);
        res.send({message : "success" , data : label});
    }catch(err){
        next(err);
    }
}

/**
 * UPDATE LABEL
 */
export const updateLabel = async (req, res, next) => {
    try {
        const label =  await updateLabelService(req.params.labelId , req.userId , req.body.name);
        res.send({message : "success" , data : label});
    }catch(err){
        next(err);
    }
}

/**
 * GET ALL LABELS
 */
export const getLabels = async (req, res, next) => {
    try {
        const label =  await getLabelsService(req.userId);
        res.send({message : "success" , data : label});
    }catch(err){
        next(err);
    }
}

/**
 * DELETE LABEL
 */
export const deleteLabel = async (req, res, next) => {
    try {
        const label =  await deleteLabelService(req.userId, req.params.labelId);

        if(label) res.send({message : "successfully deleted"});
        else res.send({message : "No Label Exists"});
    }catch(err){
        next(err);
    }
}

/**
 * GET NOTES BY LABEL
 */
export const getNotesByLabel = async (req, res, next) => {
    try {
        const notes =  await getNotesByLabelService(req.userId, req.params.labelId);
        if(notes) res.send({message : "success", data : notes});
        else res.send({message : "No Notes in Label"});
    }catch(err){
        next(err);
    }
}







