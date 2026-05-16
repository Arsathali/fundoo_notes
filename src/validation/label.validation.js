import Joi from "joi";

export const labelSchema =
   Joi.object({

      name: Joi.string()
         .min(2)
         .required()
   }).unknown(true);