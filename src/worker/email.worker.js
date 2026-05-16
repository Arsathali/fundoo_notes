import { getChannel }
from "../config/rabitMq.js";

import transporter
from "../config/mail.js";

export const startWorker =
async () => {

   const channel =
      getChannel();

   await channel.consume(

      "emailQueue",

      async (msg) => {

         try {

            const data =
               JSON.parse(
                  msg.content.toString()
               );

            console.log(
               "Sending mail to:",
               data.email
            );

            /**
             * COLLABORATION MAIL
             */
            if (
               data.type ===
               "collaboration"
            ) {

               await transporter.sendMail({

                  from:
                  process.env.EMAIL_USER,

                  to: data.email,

                  subject:
                  "Fundoo Notes Collaboration",

                  text:
                  `A note "${data.noteTitle}" was shared with you`
               });

               console.log(
                  "Collaboration mail sent"
               );
            }

            /**
             * RESET PASSWORD MAIL
             */
            else if (
               data.type ===
               "resetPassword"
            ) {

               await transporter.sendMail({

                  from:
                  process.env.EMAIL_USER,

                  to: data.email,

                  subject:
                  "Reset Your Password",

                  text:
                  `Reset your password using this link: ${data.resetLink}`
               });

               console.log(
                  "Reset password mail sent"
               );
            }

            channel.ack(msg);

         } catch (err) {
            
            console.log(err);

            /**
             * IMPORTANT
             */
            channel.nack(msg, false, false);
         }
      }
   );
};