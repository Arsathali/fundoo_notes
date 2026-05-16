import Joi from "joi";

export const collaboratorSchema =
   Joi.object({
      collaborators: Joi.array()
                        .items(
                           Joi.string()
                              .email()
                              .required()
                        )
                        .min(1)
                        .required()
   }).unknown(true);