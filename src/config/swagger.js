import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {

   definition: {
      components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

      openapi: "3.0.0",

      info: {

         title: "Fundoo Notes API",

         version: "1.0.0",

         description: "Fundoo Notes Backend APIs"
      },

      servers: [

         {
            url: "http://localhost:3000"
         }
      ]
   },

   apis: ["src/route/*.js"]
};

const swaggerSpec =
   swaggerJsdoc(options);

export {

   swaggerUi,

   swaggerSpec
};