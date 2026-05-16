

import express from "express";
import passport from "passport";
import  jwt  from "jsonwebtoken";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OAuth
 *   description: Google OAuth APIs
 */

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Start Google OAuth Login
 *     tags: [OAuth]
 *     responses:
 *       200:
 *         description: Redirects to Google login
 */
router.get(

    "/google",

    passport.authenticate(

        "google",

        {
            scope : ["profile", "email"]
        }
    )
 );


/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     tags: [OAuth]
 *     responses:
 *       200:
 *         description: Google login successful
 */
router.get(

   "/google/callback",

   passport.authenticate(

      "google",

      {
         session: false,

         failureRedirect: "/login"
      }
   ),

   async (req, res) => {

      /**
       * CREATE JWT
       */
      const token = jwt.sign(

         {
            userId: req.user._id
         },

         process.env.JWT_SECRET,

         {
            expiresIn: "1d"
         }
      );

      res.json({

         success: true,

         token,

         user: req.user
      });
   }
);

export default router;