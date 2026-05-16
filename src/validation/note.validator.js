import Joi from "joi";

export const noteSchema =
   Joi.object({

      title: Joi.string()
         .allow(""),

      content: Joi.string()
         .required(),

      color: Joi.string(),

      reminder: Joi.date()
         .allow(null)
   }).unknown(true);